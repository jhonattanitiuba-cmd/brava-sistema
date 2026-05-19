/* global React */
// ══════════════════════════════════════════════════════════════════
// PRODUCT SHOWCASE — galeria 3D perspectiva do admin Brava
// Estilo: Apple/Linear/Vercel product page
// ══════════════════════════════════════════════════════════════════
// Screenshots esperados em /screenshots/:
//   dashboard.png, whatsapp.png, pipeline.png, agenda.png, mrr.png

const SCREENS = [
  { file: 'dashboard.png',    label: 'Dashboard',    desc: 'Visão geral da operação em tempo real' },
  { file: 'whatsapp.png',     label: 'WhatsApp',     desc: 'IA respondendo, humanos assumindo quando necessário' },
  { file: 'pipeline.png',     label: 'Pipeline',     desc: 'Do lead ao fechamento, tudo organizado' },
  { file: 'analytics.png',    label: 'Analytics',    desc: 'Analise os resultados do seu tráfego' },
  { file: 'mrr.png',          label: 'MRR',          desc: 'Gestão, atendimento e vendas' },
  { file: 'chamados.png',     label: 'Suporte',      desc: 'Chamados organizados, equipe respondendo no prazo' },
  { file: 'agenda.png',       label: 'Agenda',       desc: 'Eventos e compromissos sincronizados com o time' },
  { file: 'equipe.png',       label: 'Equipe',       desc: 'Time, roles e atribuições num só lugar' },
  { file: 'configuracoes.png',label: 'Configurações',desc: 'Configure a IA do seu jeito, em minutos' },
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

        {/* Galeria 3D perspectiva — com animação de entrada por scroll */}
        <div className="reveal" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 0, position: 'relative', perspective: '1200px',
          height: 560,
          animation: 'showcase-entry 1s cubic-bezier(.22,1,.36,1) both',
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
                {/* Frame com cantos quadrados + saber constante */}
                <div style={{
                  borderRadius: 4,          /* cantos quase quadrados */
                  padding: 1.5,
                  position: 'relative',
                  background: isActive ? 'transparent' : 'rgba(255,255,255,.04)',
                  boxShadow: isActive
                    ? '0 40px 100px -20px rgba(0,0,0,.85), 0 0 50px -10px rgba(30,144,255,.22)'
                    : '0 16px 40px -10px rgba(0,0,0,.5)',
                  transition: 'box-shadow .5s',
                  overflow: 'hidden',
                }}>
                  {/* Saber: linha fina uniforme circulando a velocidade CONSTANTE
                      — beam estreito (4deg) sem cauda longa, speed visualmente uniforme */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', inset: 0, zIndex: 0,
                      background: [
                        'conic-gradient(from 0deg,',
                        '  rgba(30,144,255,.0)   0deg,',
                        '  rgba(30,144,255,.0)  354deg,',  /* quase tudo transparente */
                        '  rgba(30,144,255,.4)  356deg,',  /* rampa de entrada */
                        '  rgba(100,200,255,.9) 358deg,',  /* pico fino */
                        '  rgba(30,144,255,.4)  359deg,',  /* saída */
                        '  rgba(30,144,255,.0)  360deg',   /* = 0deg seamless */
                        ')',
                      ].join(''),
                      animation: 'showcase-saber 6s linear infinite',
                      pointerEvents: 'none',
                    }}/>
                  )}
                  {/* Fundo cobre — deixa só 1.5px de borda visível */}
                  <span style={{
                    position: 'absolute', inset: 1.5, zIndex: 1,
                    background: '#04070E',
                    pointerEvents: 'none',
                  }}/>
                  {/* Screenshot — tamanho natural, sem distorção */}
                  <div style={{
                    borderRadius: 0,          /* cantos quadrados internos */
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

      {/* Descrição abaixo do mockup — animada com perspectiva */}
      <div style={{
        textAlign: 'center', marginTop: 52, padding: '0 24px',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          animation: 'showcase-desc 0.5s cubic-bezier(.22,1,.36,1) both',
          animationDelay: '0.15s',
        }} key={active}>
          {/* Label da tela ativa */}
          <span style={{
            fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '.16em', textTransform: 'uppercase',
            color: 'rgba(30,144,255,.7)', fontWeight: 500,
          }}>{SCREENS[active]?.label}</span>
          {/* Descrição principal */}
          <p style={{
            margin: 0, fontSize: 17,
            color: 'rgba(255,255,255,.65)',
            fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.45,
            maxWidth: 480,
          }}>{SCREENS[active]?.desc}</p>
        </div>
      </div>

      <style>{`
        @keyframes showcase-entry {
          from { opacity:0; transform:perspective(900px) rotateX(10deg) translateY(40px); }
          to   { opacity:1; transform:perspective(900px) rotateX(0deg)  translateY(0); }
        }
        @keyframes showcase-desc {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </section>
  );
}

window.ProductShowcase = ProductShowcase;
