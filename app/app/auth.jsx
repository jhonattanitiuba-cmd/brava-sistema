// Auth screens — Login, Forgot password, Reset password.

const LoginScreen = ({ onContinue, onNav }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  // Lê dados vindos do checkout (plano, novo cadastro, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const planoVindo = urlParams.get('plano');
  const novoCadastro = urlParams.get('new') === '1';
  const temaVindo = urlParams.get('theme');

  // Aplica tema vindo da URL
  React.useEffect(() => {
    if (temaVindo) document.documentElement.setAttribute('data-theme', temaVindo);
  }, [temaVindo]);

  // Credenciais conhecidas
  const USERS = {
    'diretoria@brava.company': { senha: 'Liberdade@2026', nome: 'Jhonattan Itiuba',     plano: 'admin',       role: 'Diretoria' },
    'querover@brava.software':    { senha: '12345678',       nome: 'Visitante Demo',       plano: 'performance', role: 'Demo' },
  };

  const irParaSaaS = (info) => {
    const tema = document.documentElement.getAttribute('data-theme') || 'dark';
    const params = new URLSearchParams({
      user: info.nome,
      email: info.email,
      plano: info.plano,
      role: info.role,
      theme: tema,
      ...(novoCadastro ? { welcome: '1' } : {}),
    });
    window.location.href = `/admin/?${params.toString()}`;
  };

  const submit = (e) => {
    e?.preventDefault();
    if (!email.includes('@')) { setError('Informe um e-mail válido.'); return; }
    if (password.length < 4)  { setError('Informe sua senha.'); return; }
    setError('');
    setSubmitting(true);

    setTimeout(() => {
      const user = USERS[email.trim().toLowerCase()];
      if (user && user.senha === password) {
        irParaSaaS({ ...user, email });
      } else if (email.includes('@') && password.length >= 4) {
        // Cliente novo / fluxo via checkout
        const nomeFromEmail = email.split('@')[0].split('.').map(s => s[0].toUpperCase()+s.slice(1)).join(' ');
        irParaSaaS({
          nome: nomeFromEmail || 'Cliente',
          email,
          plano: planoVindo || 'performance',
          role: 'Owner',
        });
      } else {
        setSubmitting(false);
        setError('E-mail ou senha incorretos.');
      }
    }, 900);
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
              placeholder="Mínimo 10 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              suffix={
                <button type="button" className="auth-eye" onClick={() => setShowPwd(s => !s)} aria-label="Mostrar senha">
                  <Icon name={showPwd ? 'EyeOff' : 'Eye'} size={16} />
                </button>
              }
            />

            {error && <div className="auth-error"><Icon name="AlertCircle" size={14} />{error}</div>}

            <div className="auth-form__row">
              <Toggle checked={remember} onChange={setRemember} label="Manter conectado" />
              <button type="button" className="auth-link" onClick={() => onNav('forgot')}>Esqueci minha senha</button>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth iconRight="ArrowRight" loading={submitting}>
              {submitting ? 'Entrando…' : 'Entrar'}
            </Button>

            <Divider label="ou acesso rápido" />

            <div style={{display:'flex', gap:8, flexDirection:'column'}}>
              <button type="button" onClick={()=>{setEmail('diretoria@brava.company');setPassword('Liberdade@2026');}} style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                background:'rgba(123,63,228,.08)', border:'1px solid rgba(123,63,228,.25)',
                borderRadius:10, fontSize:13, color:'var(--text-1)', cursor:'pointer',
                transition:'all .15s', textAlign:'left',
              }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(123,63,228,.15)';e.currentTarget.style.borderColor='rgba(123,63,228,.45)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(123,63,228,.08)';e.currentTarget.style.borderColor='rgba(123,63,228,.25)';}}>
                <div style={{width:28, height:28, borderRadius:8, background:'linear-gradient(90deg,#7B3FE4,#1E90FF)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <Icon name="Sparkles" size={14} style={{color:'#fff'}}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600}}>Acesso Diretoria Brava</div>
                  <div style={{fontSize:11.5, color:'var(--text-2)', fontFamily:'var(--font-mono)'}}>diretoria@brava.company</div>
                </div>
                <Icon name="ArrowRight" size={14} style={{color:'var(--text-3)'}}/>
              </button>

              <button type="button" onClick={()=>{setEmail('querover@brava.software');setPassword('12345678');}} style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                background:'rgba(30,144,255,.08)', border:'1px solid rgba(30,144,255,.25)',
                borderRadius:10, fontSize:13, color:'var(--text-1)', cursor:'pointer',
                transition:'all .15s', textAlign:'left',
              }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(30,144,255,.15)';e.currentTarget.style.borderColor='rgba(30,144,255,.45)';}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(30,144,255,.08)';e.currentTarget.style.borderColor='rgba(30,144,255,.25)';}}>
                <div style={{width:28, height:28, borderRadius:8, background:'#1E90FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                  <Icon name="Eye" size={14} style={{color:'#fff'}}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600}}>Quero ver — modo demo</div>
                  <div style={{fontSize:11.5, color:'var(--text-2)', fontFamily:'var(--font-mono)'}}>querover@brava.software</div>
                </div>
                <Icon name="ArrowRight" size={14} style={{color:'var(--text-3)'}}/>
              </button>
            </div>
          </form>

          <footer className="auth-form__foot">
            <p>Sem conta? <a href="https://wa.me/5511963342541?text=Ol%C3%A1%21+Vim+pelo+site+da+Brava+e+gostaria+de+solicitar+uma+demonstra%C3%A7%C3%A3o+da+plataforma.+Pode+me+ajudar%3F" className="auth-link" target="_blank">Solicite uma demonstração</a></p>
            <div className="auth-form__legal">
              <a href="#">Privacidade</a><span>·</span><a href="#">Termos</a><span>·</span><span>LGPD compliant</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const ForgotScreen = ({ onNav }) => {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

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
            <p className="auth-card__sub">Informe seu e-mail e enviaremos um link para criar uma nova. O link expira em 30 minutos.</p>
            <form onSubmit={e => { e.preventDefault(); if (email.includes('@')) setSent(true); }} className="auth-form">
              <Input label="E-mail" icon="Mail" type="email" placeholder="voce@empresa.com.br" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              <Button variant="primary" size="lg" fullWidth type="submit" iconRight="ArrowRight">Enviar link de recuperação</Button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-card__icon-success"><Icon name="Mail" size={28} /></div>
            <h2>Verifique sua caixa de entrada</h2>
            <p className="auth-card__sub">Se houver uma conta para <b>{email}</b>, você receberá em instantes um link para criar uma nova senha.</p>
            <div className="auth-card__hints">
              <div><Icon name="Clock" size={14} /> O link expira em 30 minutos</div>
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
