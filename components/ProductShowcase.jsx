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
  { file: 'analytics.png',    label: 'Analytics',    desc: '+136% crescimento MRR · CAC R$380 · LTV R$14.250 · Churn 2.1%' },
  { file: 'mrr.png',          label: 'MRR',          desc: 'Gestão, atendimento e vendas' },
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
      {/* Passagem de luz suave esquerda → direita */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(105deg, transparent 0%, rgba(123,63,228,.06) 30%, rgba(30,144,255,.08) 55%, rgba(123,63,228,.04) 75%, transparent 100%)',
      }}/>
      {/* Glow central sutil */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 700, height: 350,
        background: 'radial-gradient(ellipse, rgba(123,63,228,.12) 0%, rgba(30,144,255,.06) 45%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
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
          {SCREENS.map((s, i) => {
            const isWa = s.file === 'whatsapp.png';
            const isSel = active === i;
            return (
              <button key={i} onClick={() => setActive(i)} style={{
                padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
                fontSize: 13, fontWeight: isSel ? 600 : 400, fontFamily: 'Inter',
                position: 'relative', overflow: 'hidden',
                /* Selecionado: azul. Não selecionado: transparente */
                background: isSel ? 'rgba(30,144,255,.18)' : 'transparent',
                color: isSel ? '#60BFFF' : 'rgba(255,255,255,.40)',
                border: isSel ? '1px solid rgba(30,144,255,.35)' : '1px solid transparent',
                transition: 'all .2s',
              }}>
                {/* Saber roxo gradiente suave no WhatsApp selecionado */}
                {isSel && isWa && (
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: 999, zIndex: 0,
                    background: 'conic-gradient(from 0deg, rgba(123,63,228,.015) 0deg, rgba(123,63,228,.015) 180deg, rgba(123,63,228,.12) 280deg, rgba(123,63,228,.55) 340deg, rgba(180,120,255,.85) 352deg, rgba(220,180,255,.9) 356deg, rgba(180,120,255,.85) 358deg, rgba(123,63,228,.015) 360deg)',
                    animation: 'showcase-saber 10s linear infinite',
                    pointerEvents: 'none',
                  }}/>
                )}
                {isSel && isWa && (
                  <span style={{ position: 'absolute', inset: 1.5, borderRadius: 999, zIndex: 1, background: 'rgba(30,144,255,.18)', pointerEvents: 'none' }}/>
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Galeria 3D perspectiva */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, position: 'relative', perspective: '1200px',
          height: 560,
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
                {/* Vidro flutuante + saber azul seamless */}
                <div style={{
                  borderRadius: 18,
                  padding: 1.5,
                  position: 'relative',
                  background: isActive ? 'transparent' : 'rgba(255,255,255,.05)',
                  boxShadow: isActive
                    ? '0 40px 100px -20px rgba(0,0,0,.85), 0 0 50px -10px rgba(30,144,255,.25), inset 0 1px 0 rgba(255,255,255,.15)'
                    : '0 16px 40px -10px rgba(0,0,0,.5)',
                  transition: 'box-shadow .5s',
                  overflow: 'hidden',
                }}>
                  {/* Saber: cometa azul constante 0→360 sem quebra
                      Linha base .015 garante que 0deg = 360deg = mesmo alfa → seamless */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', inset: 0, borderRadius: 18, zIndex: 0,
                      background: [
                        'conic-gradient(from 0deg,',
                        '  rgba(30,144,255,.015)   0deg,',
                        '  rgba(30,144,255,.015) 180deg,',   /* metade escura */
                        '  rgba(30,144,255,.12)  280deg,',   /* começa clarear */
                        '  rgba(30,144,255,.55)  340deg,',   /* cauda */
                        '  rgba(100,190,255,.85) 352deg,',   /* cabeça do cometa */
                        '  rgba(220,240,255,.95) 356deg,',   /* pico brilhante */
                        '  rgba(100,190,255,.85) 358deg,',   /* cai rápido */
                        '  rgba(30,144,255,.015) 360deg',    /* = 0deg: seamless */
                        ')',
                      ].join(''),
                      animation: 'showcase-saber 10s linear infinite',
                      pointerEvents: 'none',
                    }}/>
                  )}
                  {/* Fundo cobre o interior — deixa só 1.5px de borda visível */}
                  <span style={{
                    position: 'absolute', inset: 1.5, borderRadius: 16.5, zIndex: 1,
                    background: '#04070E',
                    pointerEvents: 'none',
                  }}/>
                  {/* Screenshot direto, sem barra */}
                  <div style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    display: 'block',
                    lineHeight: 0,
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    <img
                      key={s.file}
                      src={`/screenshots/${s.file}?v=2`}
                      alt={s.label}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        filter: isActive ? 'none' : 'brightness(.45)',
                        transition: 'filter .4s',
                      }}
                    />
                  </div>
                </div>
                <style>{`@keyframes showcase-saber { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

window.ProductShowcase = ProductShowcase;
