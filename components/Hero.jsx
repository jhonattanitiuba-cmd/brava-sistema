/* global React */
const { useState: useStateHero } = React;

function Nav() {
  const tema = () => document.documentElement.getAttribute('data-theme') || 'dark';
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a id="nav-logo" className="logo" href="#top">
          <img src="brava-logo-white.png" alt="Brava Company" style={{ height: 17, objectFit: 'contain' }} />
        </a>
        <div className="nav-links">
          <a id="nav-plataforma" href="#setores">Plataforma</a>
          <a id="nav-planos"     href="#planos">Planos</a>
          <a id="nav-clientes"   href="#prova">Clientes</a>
          <a id="nav-perguntas"  href="#faq">Perguntas</a>
          <a id="nav-whatsapp" href={WA_LINK} style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            height:38, padding:'0 18px', borderRadius:999,
            background:'#25D366', color:'#fff',
            fontSize:14, fontWeight:500, textDecoration:'none',
            border:'none', outline:'none', lineHeight:1, flexShrink:0,
          }}>WhatsApp</a>
          <a id="nav-entrar" href={`/app/?login=1&theme=${tema()}`} style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            height:38, padding:'0 18px', borderRadius:999,
            background:'#1E90FF', color:'#fff',
            fontSize:14, fontWeight:500, textDecoration:'none',
            border:'none', outline:'none', lineHeight:1, flexShrink:0,
            boxShadow:'0 4px 14px rgba(30,144,255,.35)',
          }}>Entrar</a>
        </div>
      </div>
    </nav>
  );
}

// WhatsApp oficial da Brava Company (+55 11 96334-2541)
const WA_LINK = 'https://wa.me/5511963342541?text=Ol%C3%A1!%20Vim%20pela%20LP%20da%20Brava%20e%20quero%20conhecer%20a%20plataforma';

function Hero({ accents }) {
  return (
    <section className="hero section dark" id="top" style={{
      background: 'transparent',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      {accents && (
        <>
          <div className="grid-bg"></div>
          <div className="glow-blob purple" style={{ width: 520, height: 520, top: -120, left: -120 }}></div>
          <div className="glow-blob blue" style={{ width: 480, height: 480, top: 200, right: -160 }}></div>
        </>
      )}
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="hero-overline" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18,
              fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#1E90FF',
              background: 'rgba(30,144,255,.07)', border: '1px solid rgba(30,144,255,.28)',
              borderRadius: 999, padding: '6px 14px',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#1E90FF' }}></span>
              Brava Software · Braço de tecnologia B2B
            </span>
            <h1 className="h1">
              <span className="h1-line" style={{ display: 'block' }}>A operação inteira da sua empresa,</span>
              <span className="h1-line gradient-text" style={{ display: 'block' }}>num só lugar.</span>
            </h1>
            <p className="lead hero-sub">
              <span className="lead-line" style={{ display: 'block' }}>Comercial, administrativo, jurídico, operações, tráfego,</span>
              <span className="lead-line" style={{ display: 'block' }}>marketing, financeiro e tecnologia, integrados, com a sua marca</span>
              <span className="lead-line" style={{ display: 'block' }}>e inteligência artificial plug and play: conectou, usou.</span>
            </p>
            <div className="hero-cta">
              <a href={WA_LINK} className="btn btn-primary cta-item">
                Falar com um especialista
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a href="#planos" className="btn btn-ghost cta-item">Ver planos</a>
            </div>

            <div className="hero-plans">
              {[
                { nome: 'Essencial', preco: 'R$ 1.297', desc: 'Para começar a organizar e vender melhor', destaque: false },
                { nome: 'Performance', preco: 'R$ 2.497', desc: 'Comercial, marca própria e processos no lugar', destaque: true },
                { nome: 'Scale', preco: 'R$ 4.697', desc: 'Operação consolidada, multi-time e multicanal', destaque: false },
              ].map((p) => (
                <a key={p.nome} href="#planos" className="hero-plan-card" style={{
                  display: 'block', padding: '16px 18px', borderRadius: 14, textDecoration: 'none',
                  background: p.destaque ? 'rgba(30,144,255,.06)' : 'rgba(255,255,255,.03)',
                  border: p.destaque ? '1px solid rgba(30,144,255,.35)' : '1px solid rgba(255,255,255,.08)',
                  transition: 'transform .2s, border-color .2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Inter' }}>{p.nome}</span>
                    {p.destaque && <span style={{ fontSize: 8, fontFamily: 'JetBrains Mono', letterSpacing: '.08em', color: '#1E90FF', border: '1px solid rgba(30,144,255,.35)', borderRadius: 999, padding: '2px 7px' }}>MAIS ESCOLHIDO</span>}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Inter', letterSpacing: '-0.02em', color: '#fff' }}>{p.preco}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-tertiary)' }}>/mês</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 5, lineHeight: 1.4 }}>{p.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.Nav = Nav;
window.WA_LINK = WA_LINK;
