/* global React, WA_LINK, FeatureIcon */

// Links de pagamento do Stripe — trocar pelos links de PRODUCAO quando migrar.
// Hoje sao links de TESTE (test_*) — funcionam normal mas nao cobram dinheiro real.
const STRIPE_LINKS = {
  essencial:   'https://buy.stripe.com/test_3cI00i0Sd3G1eLZ9CS9fW00',
  performance: 'https://buy.stripe.com/test_9B6eVc58tgsN33h3eu9fW01',
  scale:       'https://buy.stripe.com/test_eVq14m6cx3G1dHV2aq9fW02',
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
      { hot: true, label: 'Site institucional INCLUSO', sub: 'Construído pela Brava, integrado ao CRM. Cada visitante vira lead direto no funil.' },
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
          <div style={{ display:'inline-flex', alignItems:'center', gap:7,
            padding:'6px 16px', borderRadius:999,
            background:'#1E90FF', color:'#fff',
            fontSize:11, fontFamily:'JetBrains Mono, monospace',
            letterSpacing:'0.12em', fontWeight:600, textTransform:'uppercase',
            boxShadow:'0 4px 14px rgba(30,144,255,.35)',
          }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.75)'}}/>
            Planos
          </div>
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
                }}>{p.badge}</span>
              )}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 21,
                padding: '32px 26px',
                height: '100%',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontFamily: 'Montserrat, Inter, sans-serif', fontWeight: 400, lineHeight: 1.4 }}>{p.tag}</div>
                <h3 style={{
                  fontFamily: 'Inter', fontSize: 26, fontWeight: 600,
                  margin: '8px 0 18px', letterSpacing: '-0.02em'
                }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'Inter', fontSize: 36, fontWeight: 700,
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
                  className={`btn ${p.highlight ? '' : 'btn-ghost'}`}
                  style={{
                    width: '100%', marginBottom: 24,
                    ...(p.highlight ? {
                      background: '#1E90FF',
                      color: '#fff',
                      border: '1px solid transparent',
                      borderRadius: 12,
                      boxShadow: '0 6px 22px -6px rgba(30,144,255,.55), 0 2px 8px -3px rgba(30,144,255,.35)',
                      fontWeight: 600,
                      transition: 'transform .15s, box-shadow .2s',
                    } : {}),
                  }}
                  onMouseEnter={p.highlight ? e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 12px 30px -8px rgba(30,144,255,.65), 0 4px 12px -4px rgba(30,144,255,.40)'; } : undefined}
                  onMouseLeave={p.highlight ? e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 22px -6px rgba(30,144,255,.55), 0 2px 8px -3px rgba(30,144,255,.35)'; } : undefined}
                >
                  {p.id === 'enterprise' ? 'Conversar com vendas' : 'Assinar agora'}
                </a>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                  {p.features.map((f, i) => {
                    if (typeof f === 'string') {
                      return (
                        <li key={i} style={{
                          display: 'flex', gap: 12, alignItems: 'center',
                          fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4,
                        }}>
                          <FeatureIcon
                            text={f}
                            size={14}
                            color={p.highlight ? '#1E90FF' : '#7B3FE4'}
                            tileBg={p.highlight ? 'rgba(30,144,255,.10)' : 'rgba(123,63,228,.10)'}
                            tileBorder={p.highlight ? 'rgba(30,144,255,.22)' : 'rgba(123,63,228,.20)'}
                          />
                          <span>{f}</span>
                        </li>
                      );
                    }
                    if (f.strong) {
                      return (
                        <li key={i} style={{
                          fontSize: 11, color: 'var(--text-tertiary)',
                          fontWeight: 600, fontFamily: 'JetBrains Mono',
                          letterSpacing: '0.10em', textTransform: 'uppercase',
                          marginTop: 8, marginBottom: 2,
                          paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.06)',
                        }}>{f.strong}</li>
                      );
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
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
              l: 'Pagamento', v: 'Cartão, Pix ou boleto · mensal ou anual',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
              l: 'Configuração inclusa', v: 'Processo guiado, agentes treinados com você',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>,
              l: 'Sem fidelidade', v: 'Cancela quando quiser, sem multa',
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
              l: 'Garantia de 7 dias', v: '100% do valor de volta, sem perguntas',
            },
          ].map((x, i) => (
            <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{
                flexShrink:0, width:36, height:36, borderRadius:10,
                background:'rgba(30,144,255,.08)', border:'1px solid rgba(30,144,255,.18)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#1E90FF', marginTop:2,
              }}>{x.icon}</div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-tertiary)', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.1em', textTransform:'uppercase' }}>{x.l}</div>
                <div style={{ marginTop:5, fontSize:14, color:'var(--text-primary)', lineHeight:1.45 }}>{x.v}</div>
              </div>
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
