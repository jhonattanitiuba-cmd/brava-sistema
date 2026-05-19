/* global React */
// ══════════════════════════════════════════════════════════════════
// PRODUCT SHOWCASE — galeria 3D perspectiva do admin Brava
// Estilo: Apple/Linear/Vercel product page
// ══════════════════════════════════════════════════════════════════
// Screenshots esperados em /screenshots/:
//   dashboard.png, whatsapp.png, pipeline.png, agenda.png, mrr.png

const SCREENS = [
  { file: 'whatsapp.png',  label: 'WhatsApp Inbox',  desc: 'Atendimento centralizado com IA respondendo em tempo real' },
  { file: 'dashboard.png', label: 'Dashboard',        desc: 'Visão completa da operação: MRR, clientes, conversas e chamados' },
  { file: 'pipeline.png',  label: 'Pipeline',         desc: 'Funil kanban arrastável com todos os clientes em movimento' },
  { file: 'analytics.png', label: 'Analytics',        desc: '+136% crescimento MRR · CAC R$380 · LTV R$14.250 · Churn 2.1%' },
  { file: 'mrr.png',       label: 'MRR',              desc: 'Controle de recorrência e projeção financeira 12 meses' },
  { file: 'agenda.png',    label: 'Agenda',            desc: 'Calendário integrado com eventos e próximos compromissos' },
];

function ProductShowcase() {
  const [active, setActive] = React.useState(1); // central = dashboard
  const [hovered, setHovered] = React.useState(null);

  return (
    <section style={{
      background: '#000',
      padding: '120px 0 140px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 900, height: 500,
        background: 'radial-gradient(ellipse, rgba(123,63,228,.22) 0%, rgba(30,144,255,.12) 40%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            background: '#1E90FF', color: '#fff',
            fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(30,144,255,.35)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.75)' }}/>
            Plataforma ao vivo
          </div>
          <h2 style={{
            fontFamily: 'Inter', fontSize: 'clamp(32px,4vw,52px)',
            fontWeight: 700, color: '#F5F5F7', letterSpacing: '-.02em',
            lineHeight: 1.1, margin: 0,
          }}>
            Uma operação inteira.<br/>
            <span style={{
              background: 'linear-gradient(90deg,#7B3FE4,#1E90FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Numa única tela.</span>
          </h2>
          <p style={{ marginTop: 18, fontSize: 18, color: 'rgba(255,255,255,.60)', lineHeight: 1.5 }}>
            {SCREENS[active]?.desc || 'Tudo integrado, com seu logo, para sua equipe.'}
          </p>
        </div>

        {/* Tabs de navegação */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          flexWrap: 'wrap', marginBottom: 56,
        }}>
          {SCREENS.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, fontFamily: 'Inter',
              background: active === i ? 'rgba(30,144,255,.15)' : 'rgba(255,255,255,.04)',
              color: active === i ? '#1E90FF' : 'rgba(255,255,255,.50)',
              border: `1px solid ${active === i ? 'rgba(30,144,255,.35)' : 'rgba(255,255,255,.08)'}`,
              transition: 'all .2s',
            }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Galeria 3D perspectiva */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, position: 'relative', perspective: '1200px',
          height: 480,
        }}>
          {SCREENS.map((s, i) => {
            const offset = i - active;
            const absOff = Math.abs(offset);
            if (absOff > 2) return null; // só mostra ±2 em torno do ativo

            const isActive  = offset === 0;
            const scale     = isActive ? 1 : (absOff === 1 ? 0.80 : 0.64);
            const translateX = offset * 340;
            const rotateY   = offset * -22;
            const z         = isActive ? 0 : (absOff === 1 ? -120 : -260);
            const opacity   = isActive ? 1 : (absOff === 1 ? 0.70 : 0.35);
            const zIdx      = 10 - absOff;

            return (
              <div key={i}
                onClick={() => !isActive && setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  width: 820,
                  transform: `translateX(${translateX}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: 'all .55s cubic-bezier(.22,1,.36,1)',
                  opacity,
                  zIndex: zIdx,
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                {/* MacBook shell */}
                <div style={{
                  background: 'linear-gradient(180deg,#3A3A3C 0%,#2C2C2E 50%,#1C1C1E 100%)',
                  borderRadius: '14px 14px 4px 4px',
                  padding: '28px 14px 10px',
                  border: '1px solid rgba(255,255,255,.10)',
                  boxShadow: isActive
                    ? '0 50px 120px -30px rgba(0,0,0,.8), 0 0 80px -20px rgba(123,63,228,.35), 0 0 60px -20px rgba(30,144,255,.20)'
                    : '0 30px 60px -20px rgba(0,0,0,.6)',
                  position: 'relative',
                }}>
                  {/* Camera */}
                  <div style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#0A0A0A', border: '1px solid rgba(255,255,255,.06)',
                  }}/>
                  {/* Screen */}
                  <div style={{
                    background: '#000', borderRadius: 6,
                    border: '1px solid rgba(0,0,0,.6)',
                    overflow: 'hidden',
                    aspectRatio: '16/10',
                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,.06)' : 'none',
                  }}>
                    {/* Tab bar */}
                    <div style={{
                      height: 28, background: '#000',
                      borderBottom: '1px solid rgba(255,255,255,.06)',
                      display: 'flex', alignItems: 'center', padding: '0 10px', gap: 5,
                    }}>
                      {['#FF5F57','#FFBD2E','#28C840'].map((c,j) => (
                        <span key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
                      ))}
                    </div>
                    {/* Screenshot */}
                    <img
                      src={`/screenshots/${s.file}`}
                      alt={s.label}
                      style={{
                        width: '100%', height: 'calc(100% - 28px)',
                        objectFit: 'cover', objectPosition: 'top left',
                        display: 'block',
                        filter: isActive ? 'none' : 'brightness(.7)',
                        transition: 'filter .4s',
                      }}
                      onError={e => {
                        // Fallback elegante se screenshot ainda nao foi colocado
                        e.target.style.display = 'none';
                        const fb = document.createElement('div');
                        fb.style.cssText = `height:100%;background:#0E0E14;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.2);font-size:13px;font-family:JetBrains Mono`;
                        fb.textContent = s.label;
                        e.target.parentNode.appendChild(fb);
                      }}
                    />
                  </div>
                </div>
                {/* Base MacBook */}
                <div style={{
                  height: 5, background: 'linear-gradient(180deg,#2A2A2C,#1C1C1E)',
                  margin: '0 -2px', borderTop: '1px solid rgba(255,255,255,.04)',
                }}/>
                <div style={{
                  height: 16, background: 'linear-gradient(180deg,#222224,#1A1A1C)',
                  borderRadius: '0 0 8px 8px',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,.04)', borderTop: 'none',
                }}>
                  <div style={{ width: 90, height: 5, background: '#0A0A0A', borderRadius: '0 0 4px 4px' }}/>
                </div>
                {/* Label abaixo */}
                {isActive && (
                  <div style={{
                    textAlign: 'center', marginTop: 18,
                    fontSize: 13, color: 'rgba(255,255,255,.45)',
                    fontFamily: 'JetBrains Mono', letterSpacing: '.08em', textTransform: 'uppercase',
                  }}>{s.label}</div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

window.ProductShowcase = ProductShowcase;
