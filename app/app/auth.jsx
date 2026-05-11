// Auth screens — Login, Signup (vindo do Stripe), Esqueci senha.
// Conectado ao Supabase Auth (window.supabase).

// Helper: traduz erros comuns do Supabase pra mensagens amigáveis em PT
const translateAuthError = (msg = '') => {
  const m = String(msg).toLowerCase();
  if (m.includes('invalid login credentials'))    return 'E-mail ou senha incorretos.';
  if (m.includes('user already registered'))      return 'Este e-mail já tem cadastro. Tente entrar normalmente.';
  if (m.includes('email not confirmed'))          return 'Confirme seu e-mail antes de entrar (cheque sua caixa de entrada).';
  if (m.includes('password should be at least'))  return 'A senha precisa ter no mínimo 8 caracteres.';
  if (m.includes('email rate limit'))             return 'Muitas tentativas seguidas. Aguarde 1 minuto e tente de novo.';
  if (m.includes('network'))                      return 'Sem conexão. Verifique sua internet.';
  return msg || 'Erro ao processar. Tente novamente.';
};

// Helper: redireciona pra /admin/ com os dados do workspace
const irParaAdmin = (user, workspace, member) => {
  const tema = document.documentElement.getAttribute('data-theme') || 'dark';
  const params = new URLSearchParams({
    user:  workspace?.name || user.email,
    email: user.email,
    plano: workspace?.plan || 'trial',
    role:  member?.role === 'owner' ? 'Owner' : (member?.role === 'admin' ? 'Admin' : 'Atendente'),
    slug:  workspace?.slug || '',
    theme: tema,
  });
  window.location.href = `/admin/?${params.toString()}`;
};

// ═══════════════════════════════════════════════════════════
// LOGIN / SIGNUP SCREEN
// ═══════════════════════════════════════════════════════════
const LoginScreen = ({ onContinue, onNav }) => {
  const [email, setEmail]           = React.useState('');
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

  const submit = async (e) => {
    e?.preventDefault();
    if (!email.includes('@'))   { setError('Informe um e-mail válido.'); return; }
    if (password.length < 8)    { setError('Senha precisa ter no mínimo 8 caracteres.'); return; }
    setError(''); setInfo(''); setSubmitting(true);

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

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <div className="auth-brand-stack">
          <div className="auth-brand-stack__logo"><Logo size={56} /></div>
          <div className="auth-brand-stack__h">
            <h1>O atendimento da sua empresa,<br/><span className="grad-text">orquestrado por IA</span>.</h1>
            <p>WhatsApp, pipeline, automações e agente de IA num único workspace. Operação visível, ticket que justifica o preço.</p>
          </div>
          <div className="auth-brand-stack__pill">
            <Badge variant="brand" icon="Sparkles">v1.2 · multi-tenant</Badge>
            <span>Você está acessando: <b>EstacionePark Aeroporto</b></span>
          </div>
          <div className="auth-brand-stack__metrics">
            <div><span className="auth-metric__n">128</span><span className="auth-metric__l">conversas hoje</span></div>
            <div><span className="auth-metric__n">2.1<small>min</small></span><span className="auth-metric__l">1ª resposta</span></div>
            <div><span className="auth-metric__n">97<small>%</small></span><span className="auth-metric__l">SLA cumprido</span></div>
          </div>
        </div>
        <div className="auth-page__brand-grid" aria-hidden="true" />
      </div>

      <div className="auth-page__form">
        <div className="auth-form-wrap">
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
                  Plano <b style={{textTransform:'capitalize'}}>{planoVindo}</b> ativo. Crie seu acesso para começar.
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
              placeholder="voce@empresa.com.br"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <Input
              label="Senha"
              icon="Lock"
              type={showPwd ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
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

            <Button type="submit" variant="primary" size="lg" fullWidth iconRight="ArrowRight" loading={submitting}>
              {submitting
                ? (novoCadastro ? 'Criando…' : 'Entrando…')
                : (novoCadastro ? 'Criar conta e continuar' : 'Entrar')}
            </Button>
          </form>

          <footer className="auth-form__foot">
            <p>{novoCadastro ? 'Já tem conta?' : 'Sem conta?'}{' '}
              {novoCadastro
                ? <button type="button" className="auth-link" onClick={() => { window.location.href = '/app/'; }}>Entrar com sua conta existente</button>
                : <a href="https://wa.me/5511991612610?text=Ol%C3%A1%21+Vim+pelo+site+da+Brava+e+gostaria+de+solicitar+uma+demonstra%C3%A7%C3%A3o+da+plataforma." className="auth-link" target="_blank">Solicite uma demonstração</a>
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
              <div><Icon name="Lock" size={14} /> Uso único — depois é invalidado</div>
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
