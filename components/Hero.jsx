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
              fontSize: 11, fontFamily: 'Montserrat, sans-serif', letterSpacing: '.1em',
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
              Comercial, administrativo, jurídico, operações, tráfego, marketing, financeiro e tecnologia, integrados, com a sua marca e inteligência artificial plug and play: conectou, usou.
            </p>
            <div className="hero-cta">
              <a href={WA_LINK} className="btn btn-primary cta-item">
                Falar com um especialista
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a href="#planos" className="btn btn-ghost cta-item">Ver planos</a>
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
