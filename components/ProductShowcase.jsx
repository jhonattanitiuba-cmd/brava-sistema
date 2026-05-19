/* global React */
// ══════════════════════════════════════════════════════════════════
// PRODUCT SHOWCASE — galeria 3D perspectiva do admin Brava
// Estilo: Apple/Linear/Vercel product page
// ══════════════════════════════════════════════════════════════════
// Screenshots esperados em /screenshots/:
//   dashboard.png, whatsapp.png, pipeline.png, agenda.png, mrr.png

const SCREENS = [
  { file: 'dashboard.png',    label: 'Dashboard',    desc: 'Visão completa da operação: MRR, clientes, conversas e chamados' },
  { file: 'whatsapp.png',     label: 'WhatsApp',     desc: 'Atendimento centralizado com IA respondendo em tempo real' },
  { file: 'pipeline.png',     label: 'Pipeline',     desc: 'Funil kanban arrastável com todos os clientes em movimento' },
  { file: 'mrr.png',          label: 'MRR',          desc: 'Controle de recorrência e projeção financeira 12 meses' },
  { file: 'chamados.png',     label: 'Suporte',      desc: '5 chamados abertos · triagem por prioridade · resposta direto ao cliente' },
  { file: 'agenda.png',       label: 'Agenda',       desc: 'Calendário integrado com eventos e próximos compromissos' },
  { file: 'equipe.png',       label: 'Equipe',       desc: '4 membros · 3 online · atribuição de chamados por cargo' },
  { file: 'configuracoes.png',label: 'Configurações',desc: 'IA configurável por instância · prompts · tempo de resposta · webhooks' },
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
          display: 'flex', justifyContent: 'center', gap: 6,
          flexWrap: 'wrap', marginBottom: 56,
        }}>
          {SCREENS.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
              fontSize: 13, fontWeight: active === i ? 600 : 400, fontFamily: 'Inter',
              background: active === i ? '#000' : 'transparent',
              color: active === i ? '#fff' : 'rgba(255,255,255,.40)',
              border: active === i ? '1px solid rgba(255,255,255,.18)' : '1px solid transparent',
              transition: 'all .2s',
              boxShadow: active === i ? '0 2px 12px rgba(0,0,0,.4)' : 'none',
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
                {/* Vidro flutuante */}
                <div style={{
                  borderRadius: 20,
                  padding: 3,
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.04) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 100%)',
                  boxShadow: isActive
                    ? '0 40px 100px -20px rgba(0,0,0,.8), 0 0 60px -10px rgba(123,63,228,.30), 0 0 40px -10px rgba(30,144,255,.20), inset 0 1px 0 rgba(255,255,255,.20)'
                    : '0 20px 50px -10px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)',
                  transition: 'box-shadow .5s',
                }}>
                  {/* Screenshot direto, sem barra */}
                  <div style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    display: 'block',
                    lineHeight: 0,
                  }}>
                    <img
                      src={`/screenshots/${s.file}`}
                      alt={s.label}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        filter: isActive ? 'none' : 'brightness(.65)',
                        transition: 'filter .4s',
                      }}
                      onError={e => {
                        e.target.style.display = 'none';
                        const fb = document.createElement('div');
                        fb.style.cssText = `aspect-ratio:1536/960;background:#0E0E14;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.2);font-size:13px;font-family:JetBrains Mono,monospace;border-radius:18px`;
                        fb.textContent = s.label;
                        e.target.parentNode.appendChild(fb);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

window.ProductShowcase = ProductShowcase;
