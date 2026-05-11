// Tela de Confirmação de Pagamento + Criação de Conta
// Posição no funil: LP → Stripe → [esta tela] → Onboarding → Dashboard

const PLANO_INFO = {
  essencial:   { nome: 'Essencial',   preco: 'R$ 697',    cor: '#6E6E78',  atendentes: 3,  wpp: 1 },
  performance: { nome: 'Performance', preco: 'R$ 1.297',  cor: '#7B3FE4',  atendentes: 10, wpp: 2 },
  scale:       { nome: 'Scale',       preco: 'R$ 2.497',  cor: '#1E90FF',  atendentes: 30, wpp: 5 },
  enterprise:  { nome: 'Enterprise',  preco: 'Sob consulta', cor: '#1D9E75', atendentes: null, wpp: null },
};

const ConfirmacaoScreen = ({ onContinue }) => {
  const plano = PLANO_INFO['performance']; // Em prod: viria da query string ?plano=performance

  const [form, setForm] = React.useState({ email: '', senha: '', confirmar: '' });
  const [showSenha, setShowSenha] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'E-mail inválido.';
    if (form.senha.length < 8)      e.senha = 'Mínimo 8 caracteres.';
    if (form.senha !== form.confirmar) e.confirmar = 'As senhas não coincidem.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  if (done) {
    return (
      <div className="auth-page auth-page--center">
        <div className="auth-card" style={{ textAlign: 'center', maxWidth: 480 }}>
          <div className="auth-card__icon-success" style={{ margin: '0 auto 20px', width: 72, height: 72, borderRadius: '50%', boxShadow: '0 16px 40px rgba(123,63,228,.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Sparkles" size={32} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Conta criada!
          </h2>
          <p style={{ color: 'var(--text-2)', margin: '0 0 28px', lineHeight: 1.55 }}>
            Seu workspace está sendo preparado. Agora vamos configurar tudo juntos — leva menos de 5 minutos.
          </p>
          <button
            className="bv-btn bv-btn--primary bv-btn--lg bv-btn--full"
            onClick={() => onContinue('onboarding')}
          >
            <Icon name="ArrowRight" size={18} />
            Configurar meu workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page auth-page--center" style={{ gap: 0, padding: '80px 24px 48px' }}>

      {/* Confirmação do pagamento */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 18px',
        background: 'color-mix(in oklab, var(--success) 12%, transparent)',
        border: '1px solid color-mix(in oklab, var(--success) 35%, transparent)',
        borderRadius: 999,
        marginBottom: 32,
        fontSize: 13.5,
        color: 'var(--success)',
        fontWeight: 500,
      }}>
        <Icon name="CheckCircle" size={16} />
        Pagamento confirmado · Plano {plano.nome} · {plano.preco}/mês
      </div>

      <div className="auth-card" style={{ maxWidth: 480 }}>

        {/* Logo */}
        <div className="auth-card__logo">
          <Logo size={28} />
        </div>

        {/* Header */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Crie seu acesso
        </h2>
        <p className="auth-card__sub">
          Defina o e-mail e senha que vão entrar no sistema. Você pode convidar o time depois.
        </p>

        {/* Resumo do plano */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '14px 16px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-soft)',
          borderRadius: 10,
          marginBottom: 24,
          fontSize: 13,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Plano</span>
            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{plano.nome}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Valor</span>
            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{plano.preco}/mês</span>
          </div>
          {plano.atendentes && <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Atendentes</span>
              <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>até {plano.atendentes}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>WhatsApp</span>
              <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{plano.wpp} número{plano.wpp > 1 ? 's' : ''}</span>
            </div>
          </>}
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          <div className={`bv-field${errors.email ? ' bv-field--err' : ''}`}>
            <label className="bv-label">E-mail do administrador</label>
            <div className="bv-input-wrap">
              <span className="bv-input-icon"><Icon name="Mail" size={16} /></span>
              <input
                className="bv-input bv-input--with-icon"
                type="email"
                placeholder="voce@empresa.com.br"
                value={form.email}
                onChange={update('email')}
                autoFocus
              />
            </div>
            {errors.email && <span className="bv-hint bv-hint--err">{errors.email}</span>}
            <span className="bv-hint">Este e-mail será o Owner do workspace.</span>
          </div>

          <div className={`bv-field${errors.senha ? ' bv-field--err' : ''}`}>
            <label className="bv-label">Senha</label>
            <div className="bv-input-wrap">
              <span className="bv-input-icon"><Icon name="Lock" size={16} /></span>
              <input
                className="bv-input bv-input--with-icon"
                type={showSenha ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={update('senha')}
                style={{ paddingRight: 44 }}
              />
              <button type="button" className="auth-eye" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShowSenha(v => !v)}>
                <Icon name={showSenha ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>
            {errors.senha && <span className="bv-hint bv-hint--err">{errors.senha}</span>}
          </div>

          <div className={`bv-field${errors.confirmar ? ' bv-field--err' : ''}`}>
            <label className="bv-label">Confirmar senha</label>
            <div className="bv-input-wrap">
              <span className="bv-input-icon"><Icon name="Lock" size={16} /></span>
              <input
                className="bv-input bv-input--with-icon"
                type={showSenha ? 'text' : 'password'}
                placeholder="Repita a senha"
                value={form.confirmar}
                onChange={update('confirmar')}
              />
            </div>
            {errors.confirmar && <span className="bv-hint bv-hint--err">{errors.confirmar}</span>}
          </div>

          <button
            type="submit"
            className={`bv-btn bv-btn--primary bv-btn--lg bv-btn--full${loading ? ' bv-btn--loading' : ''}`}
            disabled={loading}
          >
            {!loading && <Icon name="ArrowRight" size={18} />}
            {loading ? 'Criando conta...' : 'Criar conta e configurar workspace'}
          </button>

        </form>

        <div className="auth-form__legal" style={{ marginTop: 18 }}>
          <span>Ao criar sua conta você aceita os</span>
          <a href="#">Termos de Uso</a>
          <span>e a</span>
          <a href="#">Política de Privacidade</a>
        </div>

      </div>
    </div>
  );
};

window.ConfirmacaoScreen = ConfirmacaoScreen;
