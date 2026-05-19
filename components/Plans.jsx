/* global React, WA_LINK */

// Stripe ainda nao configurado em producao — por enquanto botoes dos planos
// abrem o signup gratuito (trial 7 dias) com plano pre-selecionado.
// Quando Stripe for ligado, trocar pra:
//   essencial:   'https://buy.stripe.com/...',
//   performance: 'https://buy.stripe.com/...',
//   scale:       'https://buy.stripe.com/...',
function _signupUrl(plano) {
  const tema = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
  return `/app/?new=1&plano=${plano}&theme=${tema}`;
}
const STRIPE_LINKS = {
  essencial:   _signupUrl('essencial'),
  performance: _signupUrl('performance'),
  scale:       _signupUrl('scale'),
};

const PLANS = [
  {
    id: 'essencial',
    name: 'Essencial',
    tag: 'Pra começar a profissionalizar agora',
    price: 'R$ 1.297',
    cycle: '/mês',
    features: [
      '3 atendentes',
      '1 número WhatsApp',
      'Inbox compartilhada',
      'Agente de IA básico',
      'Etiquetas, contatos e respostas rápidas',
      'Configuração guiada pela Brava',
    ],
    highlight: false
  },
  {
    id: 'performance',
    name: 'Performance',
    tag: 'CRM + Site profissional integrado',
    price: 'R$ 2.497',
    cycle: '/mês',
    badge: 'MAIS ESCOLHIDO',
    features: [
      { strong: 'Tudo do Essencial, mais:' },
      '10 atendentes',
      '2 números WhatsApp',
      { hot: true, label: 'Site institucional INCLUSO', sub: 'Construído pela Brava, integrado ao CRM. Cada visitante vira lead direto no funil.' },
      'Pipeline de vendas (funil kanban)',
      'Analytics e relatórios completos',
      'Múltiplos agentes de IA configuráveis',
      'Automações e follow-up automático',
      'White-label completo (seu logo, suas cores)',
      'Suporte em até 4h úteis',
    ],
    highlight: true
  },
  {
    id: 'scale',
    name: 'Scale',
    tag: 'Operações grandes, multi-canal',
    price: 'R$ 4.697',
    cycle: '/mês',
    features: [
      { strong: 'Tudo do Performance, mais:' },
      '30 atendentes',
      '5 números WhatsApp',
      'API REST e webhooks',
      'Integração com n8n',
      'Múltiplos pipelines',
      'Suporte prioritário em até 1h',
    ],
    highlight: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tag: 'Personalização total e SLA dedicado',
    price: 'Sob consulta',
    cycle: '',
    features: [
      { strong: 'Tudo do Scale, mais:' },
      'Atendentes ilimitados',
      'Domínio próprio (crm.suaempresa.com.br)',
      'SSO corporativo',
      'Gerente de conta dedicado',
      'Onboarding com treinamento da equipe',
      'SLA de resposta em 30 minutos',
    ],
    highlight: false
  }
];

function Plans() {
  return (
    <section className="section dark" id="planos">
      <div className="grid-bg"></div>
      <div className="glow-blob purple" style={{ width: 600, height: 600, top: 100, left: '20%', opacity: 0.3 }}></div>
      <div className="glow-blob blue" style={{ width: 600, height: 600, bottom: 0, right: '10%', opacity: 0.3 }}></div>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 64px' }}>
          <div className="eyebrow"><span className="dot"></span>Planos</div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            Escolha o plano que combina com <span className="gradient-text">seu momento</span>.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          alignItems: 'stretch'
        }} className="plans-grid">
          {PLANS.map((p) => (
            <div key={p.id} style={{
              position: 'relative',
              padding: p.highlight ? 1.5 : 1,
              borderRadius: 22,
              background: p.highlight ? 'var(--brava-gradient)' : 'var(--border-dark)',
              boxShadow: p.highlight ? '0 30px 80px -20px rgba(123,63,228,0.5), 0 15px 40px -15px rgba(30,144,255,0.4)' : 'none',
              transform: p.highlight ? 'translateY(-8px)' : 'none'
            }}>
              {p.badge && (
                <span style={{
                  position: 'absolute',
                  top: -12, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, letterSpacing: '0.1em',
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'var(--brava-gradient)',
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 8px 24px -8px rgba(123,63,228,0.6)'
                }}>⭐ {p.badge}</span>
              )}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 21,
                padding: '32px 26px',
                height: '100%',
                display: 'flex', flexDirection: 'column'
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.tag}</div>
                <h3 style={{
                  fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 600,
                  margin: '8px 0 18px', letterSpacing: '-0.02em'
                }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700,
                    letterSpacing: '-0.02em',
                    background: p.highlight ? 'var(--brava-gradient)' : 'transparent',
                    WebkitBackgroundClip: p.highlight ? 'text' : 'unset',
                    WebkitTextFillColor: p.highlight ? 'transparent' : 'inherit',
                    color: p.highlight ? 'transparent' : '#fff'
                  }}>{p.price}</span>
                  {p.cycle && <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{p.cycle}</span>}
                </div>
                <a
                  href={p.id === 'enterprise' ? WA_LINK : (STRIPE_LINKS[p.id] || '#')}
                  className={`btn ${p.highlight ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ width: '100%', marginBottom: 24 }}
                >
                  {p.id === 'enterprise' ? 'Conversar com vendas' : 'Testar grátis · 7 dias'}
                </a>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
                  {p.features.map((f, i) => {
                    if (typeof f === 'string') {
                      return (
                        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2.5" style={{ flex: '0 0 16px', marginTop: 2 }}><path d="M20 6L9 17l-5-5"/></svg>
                          <span>{f}</span>
                        </li>
                      );
                    }
                    if (f.strong) {
                      return <li key={i} style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'JetBrains Mono', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{f.strong}</li>;
                    }
                    if (f.hot) {
                      return (
                        <li key={i} style={{
                          padding: '12px 14px',
                          background: 'linear-gradient(135deg, rgba(123,63,228,0.15), rgba(30,144,255,0.15))',
                          border: '1px solid rgba(123,63,228,0.3)',
                          borderRadius: 10
                        }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                            <span style={{
                              fontSize: 9, fontFamily: 'JetBrains Mono',
                              padding: '2px 6px', borderRadius: 4,
                              background: 'var(--brava-gradient)', color: '#fff'
                            }}>NOVO</span>
                            {f.label}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>{f.sub}</div>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          padding: 24,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          borderRadius: 16
        }}>
          {[
            { l: 'Pagamento', v: 'Cartão, Pix ou boleto · mensal ou anual' },
            { l: 'Configuração inclusa', v: 'Processo guiado, agentes treinados com você' },
            { l: 'Sem fidelidade', v: 'Cancela quando quiser, sem multa' },
            { l: 'Garantia de 7 dias', v: '100% do valor de volta, sem perguntas' },
          ].map((x, i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{x.l}</div>
              <div style={{ marginTop: 6, fontSize: 14, color: 'var(--text-primary)' }}>{x.v}</div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 1100px) {
            .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .plans-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.Plans = Plans;
