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

/* Swoosh muito suave ao trocar de tela
   — usa contexto compartilhado do brown noise (evita bloqueio de autoplay)
   — mais lento, mais baixo, mais suave */
function playSwoosh() {
  try {
    // Reutiliza contexto do brown noise (ja autorizado pelo usuario)
    var ctx = (typeof window._getBravaCtx === 'function')
      ? window._getBravaCtx()
      : new (window.AudioContext || window.webkitAudioContext)();
    if (!ctx) return;

    var dur  = 0.55; // mais lento: 550ms (era 220ms)
    var bufSize = Math.floor(ctx.sampleRate * dur);
    var buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    var src = ctx.createBufferSource();
    src.buffer = buf;

    // Band-pass mais estreito: varre 600 → 100Hz (mais grave/suave)
    var bpf = ctx.createBiquadFilter();
    bpf.type    = 'bandpass';
    bpf.Q.value = 2.5;
    bpf.frequency.setValueAtTime(600, ctx.currentTime);
    bpf.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + dur);

    // Volume bem baixo (.04) com ataque lento
    var gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.12); // ataque lento
    gain.gain.linearRampToValueAtTime(0,    ctx.currentTime + dur);  // fade out suave

    src.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

function ProductShowcase() {
  const [active, setActive] = React.useState(1); // central = dashboard
  const [hovered, setHovered] = React.useState(null);

  return (
    <section style={{
      background: 'transparent',
      padding: '20px 0 100px',
      overflow: 'hidden',
      position: 'relative',
    }}>

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
          flexWrap: 'wrap', marginBottom: 20,
        }}>
          {SCREENS.map((s, i) => {
            const isSel = active === i;
            return (
              <button key={i} onClick={() => { setActive(i); if (i !== active) playSwoosh(); }} style={{
                padding: '7px 16px', borderRadius: 999, cursor: 'pointer',
                fontSize: 13, fontWeight: isSel ? 600 : 400, fontFamily: 'Inter',
                background: isSel ? '#000' : 'transparent',
                color: isSel ? '#fff' : 'rgba(255,255,255,.40)',
                border: isSel ? '1.5px solid rgba(30,144,255,.55)' : '1px solid transparent',
                transition: 'all .2s',
              }}>
                {s.label}
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

            // Wiggle: período e delay únicos por card (não se sincronizam)
            const floatDur  = 4.5 + (i % 3) * 1.2;
            const floatDel  = (i * 0.7) % 3;
            const floatName = `sc-float-${i % 3}`;

            return (
              <div key={i}
                onClick={() => { if (!isActive) { setActive(i); playSwoosh(); } }}
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
                  /* Wrapper de wiggle — separado do transform 3D */
                }}
              >
                {/* Float wrapper — não interfere com transforms 3D do pai */}
                <div style={{
                  animation: `${floatName} ${floatDur}s ease-in-out ${floatDel}s infinite`,
                }}>
                {/* Frame com cantos quadrados + saber constante */}
                <div style={{
                  borderRadius: 4,          /* cantos quase quadrados */
                  padding: 2,
                  position: 'relative',
                  background: isActive ? 'transparent' : 'rgba(255,255,255,.04)',
                  boxShadow: isActive
                    ? '0 40px 100px -20px rgba(0,0,0,.85), 0 0 50px -10px rgba(30,144,255,.22)'
                    : '0 16px 40px -10px rgba(0,0,0,.5)',
                  transition: 'box-shadow .5s',
                  overflow: 'hidden',
                }}>
                  {/* Saber visível: beam 20deg, alpha forte, faz o quadrado */}
                  {isActive && (
                    <span style={{
                      position: 'absolute', inset: 0, zIndex: 0,
                      background: [
                        'conic-gradient(from 0deg,',
                        '  rgba(30,144,255,.0)   0deg,',
                        '  rgba(30,144,255,.0)  335deg,',   /* escuro */
                        '  rgba(30,144,255,.35) 345deg,',   /* rampa entrada */
                        '  rgba(80,170,255,.80) 352deg,',   /* cauda */
                        '  rgba(180,225,255,1.0) 357deg,',  /* pico — branco azulado */
                        '  rgba(80,170,255,.80) 359deg,',   /* saída rápida */
                        '  rgba(30,144,255,.0)  360deg',    /* = 0deg seamless */
                        ')',
                      ].join(''),
                      animation: 'showcase-saber 5s linear infinite',
                      pointerEvents: 'none',
                    }}/>
                  )}
                  {/* Fundo cobre — 2px de borda saber visível */}
                  <span style={{
                    position: 'absolute', inset: 2, zIndex: 1,
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
                </div>{/* fim float wrapper */}
              </div>
            );
          })}
        </div>

      </div>

      {/* Descrição abaixo do mockup — só a frase, sem repetir o label */}
      <div style={{
        textAlign: 'center', marginTop: 20, padding: '0 24px',
        position: 'relative',
      }}>
        <p style={{
          margin: 0, fontSize: 16,
          color: 'rgba(255,255,255,.55)',
          fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.45,
          animation: 'showcase-desc 0.4s cubic-bezier(.22,1,.36,1) both',
        }} key={active}>{SCREENS[active]?.desc}</p>
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
        /* 3 variações de wiggle — cada card flutua de forma diferente */
        @keyframes sc-float-0 {
          0%,100% { transform:translateY(0px) rotate(.2deg); }
          50%     { transform:translateY(-9px) rotate(-.2deg); }
        }
        @keyframes sc-float-1 {
          0%,100% { transform:translateY(-3px) rotate(-.15deg); }
          50%     { transform:translateY(6px) rotate(.15deg); }
        }
        @keyframes sc-float-2 {
          0%,100% { transform:translateY(2px) rotate(.1deg); }
          50%     { transform:translateY(-7px) rotate(-.1deg); }
        }
      `}</style>
    </section>
  );
}

window.ProductShowcase = ProductShowcase;
