/* global React */
const { useState, useEffect, useRef } = React;

/* Contador animado 0 → target */
function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { label: 'WhatsApp',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>, active: true },
  { label: 'Pipeline',  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
  { label: 'Analytics', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Config',    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.36.15.61.4.75.71"/></svg> },
];

function CRMMockup() {
  const [activeIdx, setActiveIdx] = useState(1);
  const respondidas = useCountUp(147);
  const total       = useCountUp(162);
  const seg         = useCountUp(22);

  const conversations = [
    { name: 'Carla Mendes',   preview: 'Boa noite! Tem vaga pra amanhã 14h?',   time: '23:47', tags: ['hot', 'ai'], unread: 0, ai: true,  init: 'CM' },
    { name: 'Roberto Lima',   preview: 'Pode me mandar a tabela de preços?',     time: '23:42', tags: ['novo'],      unread: 2, ai: false, init: 'RL' },
    { name: 'Juliana Prado',  preview: 'Fechado! Confirmo a visita amanhã.',     time: '23:18', tags: ['ganhou'],    unread: 0, ai: false, init: 'JP' },
    { name: 'Marcos Tavares', preview: 'Recebi a proposta, vou analisar',        time: '22:51', tags: ['proposta'],  unread: 0, ai: false, init: 'MT' },
    { name: 'Beatriz Souza',  preview: 'Quero saber mais sobre o plano…',        time: '22:09', tags: ['novo'],      unread: 1, ai: false, init: 'BS' },
  ];

  return (
    <div className="mockup-wrap">

      {/* ─── Chassi MacBook ────────────────────────────────────────── */}
      <div className="mac-shell">
        {/* Câmera */}
        <div className="mac-camera-area">
          <div className="mac-camera" />
        </div>

        {/* Tela (screen bezel preto) */}
        <div className="mac-screen">
          <div className="mockup-tab">
            {/* Dots macOS reais (vermelho / amarelo / verde) */}
            <div className="dots">
              <span style={{ background:'#FF5F57' }} />
              <span style={{ background:'#FFBD2E' }} />
              <span style={{ background:'#28C840' }} />
            </div>
            <span className="url">brava.software/admin · WhatsApp · 23:48</span>
          </div>

          <div className="crm-app">
          {/* Sidebar — espelho exato do admin real */}
          <div className="crm-rail" style={{ background:'#0E0E14', borderRight:'1px solid #1F1F2A' }}>
            {/* Logo Brava real */}
            <div className="logo-dot" style={{
              background:'transparent', width:40, height:24, marginBottom:8,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <img
                src="/admin/app/brava-logo-white.png"
                alt="Brava"
                style={{ height:14, objectFit:'contain', filter:'brightness(0) invert(1)' }}
                onError={e => { e.target.style.display='none'; e.target.parentNode.textContent='B'; }}
              />
            </div>
            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`ic${i === activeIdx ? ' active' : ''}`}
                title={item.label}
                onClick={() => setActiveIdx(i)}
                style={{
                  background: i === activeIdx ? 'rgba(123,63,228,.15)' : 'transparent',
                  borderRadius: 8, color: i === activeIdx ? '#F5F5F7' : '#6E6E78',
                }}
              >
                {item.icon}
                <span className="ic-label" style={{ color: i === activeIdx ? '#F5F5F7' : '#6E6E78' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Lista de conversas — paleta WhatsApp Web do admin */}
          <div className="crm-list" style={{ background:'#111B21', borderRight:'1px solid rgba(255,255,255,.05)' }}>
            <div className="crm-list-head" style={{ borderBottom:'1px solid rgba(255,255,255,.05)' }}>
              <h4 style={{ color:'#E8E8E8' }}>WhatsApp</h4>
              <span className="badge" style={{
                background:'rgba(37,211,102,.15)', color:'#25D366',
                border:'1px solid rgba(37,211,102,.3)', borderRadius:6,
                padding:'2px 8px', fontSize:9, fontWeight:700,
              }}>23</span>
            </div>
            <div className="crm-search" style={{ background:'rgba(255,255,255,.04)', borderRadius:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A0A0AA" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span style={{ color:'#6E6E78' }}>Pesquisar ou começar uma nova co…</span>
            </div>
            {conversations.map((c, i) => (
              <div key={i} className={`crm-row${i === 0 ? ' active' : ''}`}>
                <div className={`crm-avatar${c.ai ? ' ai' : ''}`}>
                  {c.init}
                  {c.ai && <span className="badge">AI</span>}
                </div>
                <div className="meta">
                  <div className="top">
                    <span className="name">{c.name}</span>
                    <span className="time">{c.time}</span>
                  </div>
                  <div className="preview">{c.preview}</div>
                  <div className="tags">
                    {c.tags.map(t => (
                      <span key={t} className={`tag${t === 'hot' ? ' hot' : t === 'ai' ? ' ai' : ''}`}>
                        {t === 'hot' ? '🔥 quente' : t === 'ai' ? 'IA' : t}
                      </span>
                    ))}
                  </div>
                </div>
                {c.unread > 0 && <span className="unread">{c.unread}</span>}
              </div>
            ))}
          </div>

          {/* Conversa — espelho do admin real */}
          <div className="crm-conv" style={{ background:'#0B141A' }}>
            {/* Header da conversa — igual ao admin */}
            <div className="crm-conv-head" style={{
              background:'#202C33', borderBottom:'1px solid rgba(255,255,255,.06)',
              padding:'10px 14px',
            }}>
              <div className="crm-avatar" style={{ width:36, height:36, fontSize:12, background:'linear-gradient(135deg,#7B3FE4,#1E90FF)' }}>CM</div>
              <div className="who">
                <div className="n" style={{ color:'#E8E8E8', fontWeight:600 }}>Carla Mendes</div>
                <div className="s" style={{ color:'#25D366', fontSize:10 }}>● online</div>
              </div>
              <div className="actions" style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
                {/* Pill IA ATIVA — igual ao admin */}
                <span style={{
                  display:'flex', alignItems:'center', gap:5,
                  padding:'4px 10px', borderRadius:999,
                  background:'rgba(37,211,102,.12)', border:'1px solid rgba(37,211,102,.3)',
                  fontSize:10, fontWeight:700, color:'#25D366',
                }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#25D366', display:'inline-block' }}/>
                  IA ATIVA
                </span>
                {/* Botão Atribuir */}
                <span style={{
                  padding:'4px 10px', borderRadius:6,
                  border:'1px solid rgba(255,255,255,.10)', fontSize:10, color:'#A0A0AA',
                }}>+ Atribuir</span>
              </div>
            </div>
            {/* Thread */}
            <div className="crm-thread">
              <div className="msg in" style={{ background:'#1F2C33', color:'#E8E8E8' }}>
                Boa noite! Vi o anúncio. Tem vaga pra avaliação amanhã às 14h?
                <div className="stamp" style={{ color:'rgba(255,255,255,.45)' }}>23:47</div>
              </div>
              <div className="msg out" style={{ background:'#005C4B', color:'#E8E8E8' }}>
                Oi Carla! Temos sim 👋 Avaliação gratuita, 40 min. Reservo 14h pra você?
                <div className="stamp" style={{ color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:8, background:'rgba(123,63,228,.4)', padding:'1px 5px', borderRadius:3 }}>IA</span>
                  23:47 · 18s
                </div>
              </div>
              <div className="msg in" style={{ background:'#1F2C33', color:'#E8E8E8' }}>
                Pode reservar. É na unidade Alphaville?
                <div className="stamp" style={{ color:'rgba(255,255,255,.45)' }}>23:48</div>
              </div>
              <div className="msg out" style={{ background:'#005C4B', color:'#E8E8E8' }}>
                Reservado ✅ Al. Rio Negro 503. Lembrete 1h antes. Adiantar a ficha?
                <div className="stamp" style={{ color:'rgba(255,255,255,.5)', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ fontSize:8, background:'rgba(123,63,228,.4)', padding:'1px 5px', borderRadius:3 }}>IA</span>
                  23:48 · 22s
                </div>
              </div>
              <div className="crm-typing"><span></span><span></span><span></span></div>
            </div>
            {/* Compose — banner exato do admin */}
            <div className="crm-compose" style={{ background:'rgba(32,44,51,.95)', borderTop:'1px solid rgba(255,255,255,.06)' }}>
              <span style={{ color:'#A0A0AA', fontSize:12 }}>IA ativa · Para assumir, digite <b style={{ color:'#7B3FE4' }}>"Vamos lá"</b></span>
              <div className="ai-toggle" style={{
                background:'rgba(37,211,102,.12)', border:'1px solid rgba(37,211,102,.3)',
                color:'#25D366', borderRadius:6, padding:'3px 8px', fontSize:10, fontWeight:700,
              }}>● IA ATIVA</div>
            </div>
          </div>
          </div>
        </div>{/* fim mac-screen */}
      </div>{/* fim mac-shell */}

      {/* Base do MacBook */}
      <div className="mac-hinge" />
      <div className="mac-base">
        <div className="mac-notch" />
      </div>
    </div>
  );
}

window.CRMMockup = CRMMockup;
