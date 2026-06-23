// Auth screens - Login, Signup (vindo do Stripe), Esqueci senha.
// Conectado ao Supabase Auth (window.supabase).

// Helper: traduz erros comuns do Supabase pra mensagens amigáveis em PT
const translateAuthError = (msg = '') => {
  const m = String(msg).toLowerCase();
  if (m.includes('invalid login credentials'))    return 'E-mail ou senha incorretos.';
  if (m.includes('user already registered'))      return 'Este e-mail já tem cadastro. Tente entrar normalmente.';
  if (m.includes('email not confirmed'))          return 'Confirme seu e-mail antes de entrar (cheque sua caixa de entrada).';
  if (m.includes('password should be at least'))  return 'A senha precisa ter no mínimo 8 caracteres.';
  if (m.includes('email rate limit'))             return 'Muitas tentativas seguidas. Aguarde 1 minuto e tente de novo.';
  // "Failed to fetch" e variantes = servidor de Auth do Supabase fora do ar
  // (HTTP 522/503 do Cloudflare). Nao confundir o user com "credencial errada".
  if (m.includes('failed to fetch') || m.includes('networkerror') || m.includes('load failed')) {
    return 'Servidor de autenticação temporariamente indisponível. Aguarde alguns segundos e tente de novo.';
  }
  if (m.includes('network'))                      return 'Sem conexão. Verifique sua internet.';
  if (m.includes('timeout'))                      return 'Conexão lenta com o servidor. Tente de novo.';
  if (m.includes('522') || m.includes('503'))     return 'Servidor temporariamente indisponível. Aguarde alguns segundos.';
  return msg || 'Erro ao processar. Tente novamente.';
};

// Helper: redireciona pra /admin/ com os dados do workspace
const irParaAdmin = (user, workspace, member) => {
  const tema = document.documentElement.getAttribute('data-theme') || 'dark';
  // Nome real do usuario: prioridade pra user_metadata.nome (setado no signup), depois name, depois email
  const nomeReal = user?.user_metadata?.nome
                || user?.user_metadata?.name
                || user?.user_metadata?.full_name
                || (user?.email || '').split('@')[0];
  const params = new URLSearchParams({
    user:  nomeReal,
    email: user.email,
    plano: workspace?.plan || 'trial',
    role:  member?.role === 'owner' ? 'Owner' : (member?.role === 'admin' ? 'Admin' : 'Atendente'),
    slug:  workspace?.slug || '',
    workspace_name: workspace?.name || '',
    theme: tema,
  });
  window.location.href = `/admin/?${params.toString()}`;
};

// ═══════════════════════════════════════════════════════════
// LOGIN / SIGNUP SCREEN
// ═══════════════════════════════════════════════════════════
const LoginScreen = ({ onContinue, onNav }) => {
  // Pré-popula com o último e-mail usado (se houver) pra ser só "Enter"
  const lastEmail = (() => {
    try { return localStorage.getItem('brava_last_email') || ''; }
    catch { return ''; }
  })();
  const [email, setEmail]           = React.useState(lastEmail);
  const [password, setPassword]     = React.useState('');
  const [showPwd, setShowPwd]       = React.useState(false);
  const [remember, setRemember]     = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError]           = React.useState('');
  const [info, setInfo]             = React.useState('');

  // Lê dados vindos do checkout (Stripe)
  const urlParams      = new URLSearchParams(window.location.search);
  const planoVindo     = urlParams.get('plano');
  const novoCadastro   = urlParams.get('new') === '1';
  const temaVindo      = urlParams.get('theme');
  const stripeSession  = urlParams.get('session_id');

  // Aplica tema vindo da URL
  React.useEffect(() => {
    if (temaVindo) document.documentElement.setAttribute('data-theme', temaVindo);
  }, [temaVindo]);

  // Foca no campo senha automaticamente se email ja vier preenchido
  React.useEffect(() => {
    if (lastEmail) {
      setTimeout(() => {
        const el = document.getElementById('login-password');
        if (el) el.focus();
      }, 50);
    }
  }, [lastEmail]);

  // Retorno do "Entrar com o Google": detecta a sessao que o Supabase estabelece
  // ao voltar do OAuth e roteia. Para e-mails da allowlist (ex: o Google do dono),
  // garante o workspace via auth-bootstrap antes de cair no onboarding.
  // skipAutoRef evita interferir no login por senha (que roteia no submit).
  const skipAutoRef = React.useRef(false);
  React.useEffect(() => {
    let cancelado = false;
    const rotear = async (sessionUser) => {
      try {
        const { data: members } = await window.supabase
          .from('workspace_members')
          .select('role, workspaces(id, slug, name, plan)')
          .eq('user_id', sessionUser.id).limit(1);
        if (members && members.length > 0 && members[0].workspaces) { irParaAdmin(sessionUser, members[0].workspaces, members[0]); return true; }
        const { data: bs } = await window.supabase.functions.invoke('auth-bootstrap');
        if (bs && bs.ok && bs.workspace) { irParaAdmin(sessionUser, bs.workspace, bs.member); return true; }
        onContinue && onContinue('onboarding'); return true;
      } catch (_e) { return false; }
    };
    (async () => {
      for (let i = 0; i < 8 && !cancelado; i++) {
        if (skipAutoRef.current) return; // login por senha cuida do roteamento
        try {
          const { data } = await window.supabase.auth.getSession();
          if (data?.session?.user) { if (await rotear(data.session.user)) return; }
        } catch (_e) {}
        await new Promise(r => setTimeout(r, 400));
      }
    })();
    return () => { cancelado = true; };
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    if (!email.includes('@'))   { setError('Informe um e-mail válido.'); return; }
    if (password.length < 8)    { setError('Senha precisa ter no mínimo 8 caracteres.'); return; }
    setError(''); setInfo(''); setSubmitting(true);
    skipAutoRef.current = true; // login por senha: o submit roteia, nao o detector OAuth

    try {
      if (!window.supabase) throw new Error('Supabase não carregado.');

      // ─── FLUXO SIGNUP (cliente novo vindo do Stripe) ───
      if (novoCadastro) {
        const { data, error: e1 } = await window.supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              plano: planoVindo,
              stripe_session_id: stripeSession,
              source: 'stripe_checkout',
            },
          },
        });
        if (e1) throw e1;

        // Se Supabase exigir confirmação de email, data.session vem null
        if (data.user && !data.session) {
          setInfo('Conta criada! Verifique seu e-mail pra confirmar antes de entrar.');
          setSubmitting(false);
          return;
        }

        // Auto-logado → vai pro onboarding
        onContinue('onboarding');
        return;
      }

      // ─── FLUXO LOGIN (cliente existente) ───
      const { data, error: e2 } = await window.supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (e2) throw e2;

      // Persiste o ultimo email pro proximo login ja vir preenchido
      try { localStorage.setItem('brava_last_email', email.trim().toLowerCase()); } catch {}

      // Verifica se o usuário tem workspace
      const { data: members } = await window.supabase
        .from('workspace_members')
        .select('role, workspaces(id, slug, name, plan)')
        .eq('user_id', data.user.id)
        .limit(1);

      if (members && members.length > 0 && members[0].workspaces) {
        irParaAdmin(data.user, members[0].workspaces, members[0]);
      } else {
        // Logado mas sem workspace ainda → onboarding
        onContinue('onboarding');
      }
    } catch (err) {
      setSubmitting(false);
      setError(translateAuthError(err?.message));
    }
  };

  // ─── Entrar com o Google (Supabase Auth, provedor Google) ───
  const entrarComGoogle = async () => {
    setError('');
    try {
      const { error: eg } = await window.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/app/' },
      });
      if (eg) throw eg;
    } catch (err) {
      setError(translateAuthError(err?.message) || 'Não foi possível entrar com o Google.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        {/* Glow blobs animados (estilo LP) */}
        <div className="auth-glow-blob auth-glow-blob--purple" aria-hidden="true" />
        <div className="auth-glow-blob auth-glow-blob--blue" aria-hidden="true" />
        <div className="auth-page__brand-grid" aria-hidden="true" />

        <div className="auth-brand-stack">
          <div className="auth-brand-stack__logo">
            <Logo size={40} mode="white" style={{ color: '#fff' }} />
          </div>
          <div className="auth-brand-stack__h">
            <h1>Sua plataforma de atendimento<br/>completa <span className="grad-text">orquestrada por IA</span>.</h1>
            <p>
              WhatsApp, pipeline, automações e Agente de IA<br/>
              num único workspace.<br/>
              Simples assim.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-page__form">
        <div className="auth-form-wrap">
          <div className="auth-form__logo">
            <Logo size={30} mode="white" style={{ color: '#0A0A0F' }} />
          </div>
          {novoCadastro && (
            <div style={{
              padding:'12px 14px', marginBottom:20,
              background:'rgba(29,158,117,.12)', border:'1px solid rgba(29,158,117,.3)',
              borderRadius:10, display:'flex', alignItems:'center', gap:10,
            }}>
              <div style={{width:28, height:28, borderRadius:'50%', background:'rgba(29,158,117,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                <Icon name="Check" size={15} style={{color:'#1D9E75'}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600, fontSize:13.5, color:'var(--text-1)'}}>Pagamento confirmado!</div>
                <div style={{fontSize:12, color:'var(--text-2)', marginTop:2}}>
                  Crie seu acesso para começar.
                </div>
              </div>
            </div>
          )}

          <header className="auth-form__head">
            <h2>{novoCadastro ? 'Criar seu acesso' : 'Entrar na sua conta'}</h2>
            <p>{novoCadastro ? 'Defina o e-mail e senha do administrador da conta.' : 'Bem-vindo de volta. Acesse seu workspace.'}</p>
          </header>

          <form onSubmit={submit} className="auth-form">
            <Input
              label="E-mail"
              icon="Mail"
              placeholder="login@brava.company"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus={!lastEmail}
            />
            <Input
              id="login-password"
              label="Senha"
              icon="Lock"
              type={showPwd ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus={!!lastEmail}
              suffix={
                <button type="button" className="auth-eye" onClick={() => setShowPwd(s => !s)} aria-label="Mostrar senha">
                  <Icon name={showPwd ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              }
            />

            {error && <div className="auth-error"><Icon name="AlertCircle" size={14} />{error}</div>}
            {info  && (
              <div style={{padding:'10px 12px', borderRadius:10, background:'rgba(24,95,165,.12)', border:'1px solid rgba(24,95,165,.3)', display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text-1)'}}>
                <Icon name="Info" size={14} style={{color:'#185FA5'}}/>{info}
              </div>
            )}

            <div className="auth-form__row">
              <Toggle checked={remember} onChange={setRemember} label="Manter conectado" />
              {!novoCadastro && <button type="button" className="auth-link" onClick={() => onNav('forgot')}>Esqueci minha senha</button>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              iconRight="ArrowRight"
              loading={submitting}
              className={novoCadastro ? 'btn-signup-dark' : ''}
            >
              {submitting
                ? (novoCadastro ? 'Criando…' : 'Entrando…')
                : (novoCadastro ? 'Crie seu acesso para começar' : 'Entrar')}
            </Button>
          </form>

          {!novoCadastro && (
            <>
              <div style={{display:'flex', alignItems:'center', gap:12, margin:'18px 0', color:'var(--text-3, #9aa)'}}>
                <div style={{flex:1, height:1, background:'var(--border, rgba(255,255,255,.12))'}}/>
                <span style={{fontSize:12}}>ou</span>
                <div style={{flex:1, height:1, background:'var(--border, rgba(255,255,255,.12))'}}/>
              </div>
              <button type="button" onClick={entrarComGoogle} style={{
                width:'100%', height:46, display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                background:'#fff', color:'#3c4043', border:'1px solid #dadce0', borderRadius:10,
                fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
              }}>
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Entrar com o Google
              </button>
            </>
          )}

          <footer className="auth-form__foot">
            <p>{novoCadastro ? 'Já tem conta?' : 'Sem conta?'}{' '}
              {novoCadastro
                ? <button type="button" className="auth-link" onClick={() => { window.location.href = '/app/'; }}>Entrar com sua conta existente</button>
                : <a href="https://wa.me/5511963342541?text=Ol%C3%A1%21+Vim+pelo+site+da+Brava+e+gostaria+de+solicitar+uma+demonstra%C3%A7%C3%A3o+da+plataforma." className="auth-link" target="_blank">Solicite uma demonstração</a>
              }
            </p>
            <div className="auth-form__legal">
              <a href="#">Privacidade</a><span>·</span><a href="#">Termos</a><span>·</span><span>LGPD compliant</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FORGOT PASSWORD SCREEN
// ═══════════════════════════════════════════════════════════
const ForgotScreen = ({ onNav }) => {
  const [email, setEmail]   = React.useState('');
  const [sent, setSent]     = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError]   = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Informe um e-mail válido.'); return; }
    setError(''); setSubmitting(true);
    try {
      if (!window.supabase) throw new Error('Supabase não carregado.');
      const { error: e1 } = await window.supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/app/?recovery=1` },
      );
      if (e1) throw e1;
      setSent(true);
    } catch (err) {
      setError(translateAuthError(err?.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-page--center">
      <div className="auth-card">
        <button className="auth-back" onClick={() => onNav('login')}>
          <Icon name="ArrowLeft" size={16} /> Voltar para login
        </button>

        <div className="auth-card__logo"><Logo size={40} /></div>

        {!sent ? (
          <>
            <h2>Esqueceu sua senha?</h2>
            <p className="auth-card__sub">Informe seu e-mail e enviaremos um link para criar uma nova. O link expira em 1 hora.</p>
            <form onSubmit={submit} className="auth-form">
              <Input label="E-mail" icon="Mail" type="email" placeholder="voce@empresa.com.br" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              {error && <div className="auth-error"><Icon name="AlertCircle" size={14} />{error}</div>}
              <Button variant="primary" size="lg" fullWidth type="submit" iconRight="ArrowRight" loading={submitting}>
                {submitting ? 'Enviando…' : 'Enviar link de recuperação'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-card__icon-success"><Icon name="Mail" size={28} /></div>
            <h2>Verifique sua caixa de entrada</h2>
            <p className="auth-card__sub">Se houver uma conta para <b>{email}</b>, você receberá em instantes um link para criar uma nova senha.</p>
            <div className="auth-card__hints">
              <div><Icon name="Clock" size={14} /> O link expira em 1 hora</div>
              <div><Icon name="Lock" size={14} /> Uso único - depois é invalidado</div>
              <div><Icon name="Info" size={14} /> Não recebeu? Confira o spam ou tente novamente</div>
            </div>
            <Button variant="ghost" size="md" fullWidth onClick={() => setSent(false)}>Reenviar para outro e-mail</Button>
          </>
        )}
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
window.ForgotScreen = ForgotScreen;
window.irParaAdmin = irParaAdmin;
