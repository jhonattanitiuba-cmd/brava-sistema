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
      <div className="floater float-tl">
        <div className="lab">Hoje · respondidas pela IA</div>
        <div className="val">{respondidas} / {total}</div>
      </div>
      <div className="floater float-br">
        <div className="lab">Tempo médio de resposta</div>
        <div className="val">{seg} seg</div>
      </div>

      <div className="mockup-frame">
        <div className="mockup-tab">
          <div className="dots"><span></span><span></span><span></span></div>
          <span className="url">crm.brava.software · WhatsApp · 23:48</span>
        </div>

        <div className="crm-app">
          {/* Sidebar com labels */}
          <div className="crm-rail">
            <div className="logo-dot">B</div>
            {NAV_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`ic${i === activeIdx ? ' active' : ''}`}
                title={item.label}
                onClick={() => setActiveIdx(i)}
              >
                {item.icon}
                <span className="ic-label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Lista */}
          <div className="crm-list">
            <div className="crm-list-head">
              <h4>WhatsApp</h4>
              <span className="badge">23 ABERTAS</span>
            </div>
            <div className="crm-search">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <span>Buscar conversas…</span>
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

          {/* Conversa */}
          <div className="crm-conv">
            <div className="crm-conv-head">
              <div className="crm-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>CM</div>
              <div className="who">
                <div className="n">Carla Mendes</div>
                <div className="s">online · vindo de Stories Meta · 1ª vez</div>
              </div>
              <div className="actions">
                <span className="pill"><span className="live"></span>IA · VENDAS</span>
              </div>
            </div>
            <div className="crm-thread">
              <div className="msg in">
                Boa noite! Vi o anúncio. Tem vaga pra avaliação amanhã às 14h?
                <div className="stamp">23:47</div>
              </div>
              <div className="msg out">
                Oi Carla! Temos sim 👋 Avaliação gratuita, 40 minutos. Reservo 14h pra você?
                <div className="stamp"><span className="ai-tag">IA · Vendas</span> 23:47 · 18s</div>
              </div>
              <div className="msg in">
                Pode reservar. É na unidade Alphaville?
                <div className="stamp">23:48</div>
              </div>
              <div className="msg out">
                Reservado ✅ Al. Rio Negro 503. Lembrete 1h antes. Adiantar a ficha?
                <div className="stamp"><span className="ai-tag">IA · Vendas</span> 23:48 · 22s</div>
              </div>
              <div className="crm-typing"><span></span><span></span><span></span></div>
            </div>
            <div className="crm-compose">
              <span>Digite para assumir a conversa…</span>
              <div className="ai-toggle">⚡ IA ATIVA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CRMMockup = CRMMockup;
