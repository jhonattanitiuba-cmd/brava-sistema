/* global React, WA_LINK, FeatureIcon */

// Links para tela de checkout propria (brava.software/checkout/?plano=X)
const CHECKOUT_LINKS = {
  essencial:   '/checkout/?plano=essencial',
  performance: '/checkout/?plano=performance',
  scale:       '/checkout/?plano=scale',
};

const PLANS = [
  {
    id: 'essencial',
    name: 'Essencial',
    tag: 'Pra começar a profissionalizar agora',
    perfil: 'Profissional ou negócio que está começando a se organizar e quer vender melhor.',
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
    perfil: 'PME em crescimento que quer comercial, marca própria e os primeiros processos no lugar.',
    price: 'R$ 2.497',
    cycle: '/mês',
    badge: 'MAIS ESCOLHIDO',
    features: [
      { strong: 'Tudo do Essencial, mais:' },
      '10 atendentes',
      '2 números WhatsApp',
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
    perfil: 'Operação consolidada ou multi-unidade, com tráfego, site e vários times.',
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
    perfil: 'Grupos, franquias e redes que precisam de personalização total e SLA dedicado.',
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

// Tabela comparativa (conceito Google AI Plans): linhas de recurso × 4 planos.
const COMPARE_COLS = ['Essencial', 'Performance', 'Scale', 'Enterprise'];
const COMPARE_ROWS = [
  { grupo: 'Operação' },
  { label: 'Atendentes',                 vals: ['3', '10', '30', 'Ilimitado'] },
  { label: 'Números de WhatsApp',        vals: ['1', '2', '5', 'Ilimitado'] },
  { label: 'Inbox compartilhada',        vals: [true, true, true, true] },
  { label: 'Etiquetas, contatos e respostas rápidas', vals: [true, true, true, true] },
  { grupo: 'Inteligência' },
  { label: 'Agente de IA',               vals: ['Básico', 'Múltiplos', 'Múltiplos', 'Múltiplos'] },
  { label: 'Automações e follow-up automático', vals: [false, true, true, true] },
  { label: 'Pipeline de vendas (funil kanban)', vals: [false, true, 'Múltiplos', 'Múltiplos'] },
  { label: 'Analytics e relatórios completos',  vals: [false, true, true, true] },
  { grupo: 'Marca e presença' },
  { label: 'White-label (seu logo, suas cores)', vals: [false, true, true, true] },
  { label: 'Site institucional incluso', vals: [false, false, true, true] },
  { label: 'Domínio próprio (crm.suaempresa.com.br)', vals: [false, false, false, true] },
  { grupo: 'Integrações e suporte' },
  { label: 'API REST e webhooks',        vals: [false, false, true, true] },
  { label: 'Integração com n8n',         vals: [false, false, true, true] },
  { label: 'SSO corporativo',            vals: [false, false, false, true] },
  { label: 'Gerente de conta dedicado',  vals: [false, false, false, true] },
  { label: 'Suporte', vals: ['Guiado', 'Até 4h úteis', 'Prioritário 1h', 'SLA 30min'] },
];

function CompareCell({ v }) {
  if (v === true) return (
    <span style={{ display:'inline-flex', width:22, height:22, borderRadius:999, background:'rgba(30,144,255,.14)', border:'1px solid rgba(30,144,255,.3)', color:'#1E90FF', alignItems:'center', justifyContent:'center' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
  );
  if (v === false) return <span style={{ color:'rgba(255,255,255,.18)', fontSize:18 }}>·</span>;
  return <span style={{ fontSize:13.5, color:'var(--text-primary)', fontWeight:500 }}>{v}</span>;
}

function PlansComparison() {
  return (
    <div className="plans-compare-wrap" style={{ marginTop: 64 }}>
      <div style={{ textAlign:'center', marginBottom: 28 }}>
        <h3 style={{ fontFamily:'Montserrat', fontSize:24, fontWeight:600, letterSpacing:'-0.02em', margin:0 }}>
          Compare os planos <span className="gradient-text">lado a lado</span>
        </h3>
      </div>
      <div style={{ overflowX:'auto', borderRadius:18, border:'1px solid var(--border-dark)', background:'var(--bg-card)' }}>
        <table className="plans-compare" style={{ width:'100%', borderCollapse:'collapse', minWidth:720 }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:'18px 22px', fontSize:13, color:'var(--text-tertiary)', fontWeight:500, position:'sticky', left:0, background:'var(--bg-card)' }}>Recurso</th>
              {COMPARE_COLS.map((c, i) => (
                <th key={c} style={{ padding:'18px 16px', textAlign:'center', minWidth:130,
                  fontFamily:'Montserrat', fontSize:15, fontWeight:600,
                  color: i===1 ? 'transparent' : '#fff',
                  background: i===1 ? 'var(--brava-gradient)' : 'transparent',
                  WebkitBackgroundClip: i===1 ? 'text' : 'unset', WebkitTextFillColor: i===1 ? 'transparent' : 'inherit',
                }}>
                  {c}{i===1 && <div style={{ fontSize:9, fontFamily:'Montserrat', letterSpacing:'.08em', color:'#1E90FF', marginTop:2 }}>MAIS ESCOLHIDO</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r, i) => r.grupo ? (
              <tr key={i}>
                <td colSpan={5} style={{ padding:'18px 22px 8px', fontSize:11, fontFamily:'Montserrat', letterSpacing:'.12em', textTransform:'uppercase', color:'#7B3FE4', fontWeight:600 }}>{r.grupo}</td>
              </tr>
            ) : (
              <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,.05)' }}>
                <td style={{ padding:'13px 22px', fontSize:14, color:'var(--text-secondary)', position:'sticky', left:0, background:'var(--bg-card)' }}>{r.label}</td>
                {r.vals.map((v, j) => (
                  <td key={j} style={{ padding:'13px 16px', textAlign:'center', background: j===1 ? 'rgba(30,144,255,.04)' : 'transparent' }}>
                    <CompareCell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Plans() {
  return (
    <section className="section dark" id="planos">
      <div className="grid-bg"></div>
      <div className="glow-blob purple" style={{ width: 600, height: 600, top: 100, left: '20%', opacity: 0.3 }}></div>
      <div className="glow-blob blue" style={{ width: 600, height: 600, bottom: 0, right: '10%', opacity: 0.3 }}></div>
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Planos e precos</div>
          <h2 className="h2" style={{ marginTop: 18 }}>
            Escolha o plano que combina com <span className="gradient-text">seu momento</span>.
          </h2>
          <p className="sec-sub">Todos os planos incluem configuracao guiada, agente de IA treinado e suporte direto. Sem fidelidade, sem surpresa.</p>
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
                  fontFamily: 'Montserrat, sans-serif',
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
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontFamily: 'Montserrat, sans-serif', fontWeight: 400, lineHeight: 1.4 }}>{p.tag}</div>
                <h3 style={{
                  fontFamily: 'Montserrat', fontSize: 26, fontWeight: 700,
                  margin: '8px 0 12px', letterSpacing: '-0.02em'
                }}>{p.name}</h3>
                {p.perfil && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 10, fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 5 }}>Para quem é</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{p.perfil}</div>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'Montserrat', fontSize: 36, fontWeight: 700,
                    letterSpacing: '-0.02em',
                    background: p.highlight ? 'var(--brava-gradient)' : 'transparent',
                    WebkitBackgroundClip: p.highlight ? 'text' : 'unset',
                    WebkitTextFillColor: p.highlight ? 'transparent' : 'inherit',
                    color: p.highlight ? 'transparent' : '#fff'
                  }}>{p.price}</span>
                  {p.cycle && <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{p.cycle}</span>}
                </div>
                <a
                  href={p.id === 'enterprise' ? WA_LINK : (CHECKOUT_LINKS[p.id] || '#')}
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
                          fontWeight: 600, fontFamily: 'Montserrat',
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
                              fontSize: 9, fontFamily: 'Montserrat',
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

        <PlansComparison />

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
                <div style={{ fontSize:11, color:'var(--text-tertiary)', fontFamily:'Montserrat, sans-serif', letterSpacing:'0.1em', textTransform:'uppercase' }}>{x.l}</div>
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
