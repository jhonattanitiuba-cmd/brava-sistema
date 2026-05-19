/* global React, CRMMockup */
const { useState: useStateHero } = React;

/* ── Botão WhatsApp: ghost + saber verde delicado na borda (8s),
      hover preenche inteiro de verde ──────────────────────────── */
function WaBtn({ href }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          height: 40, padding: '0 18px', borderRadius: 999,
          fontSize: 14, fontWeight: 500, textDecoration: 'none', flexShrink: 0,
          color: hovered ? '#fff' : '#25D366',
          background: hovered ? '#25D366' : 'transparent',
          transition: 'background .25s ease, color .25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Anel saber verde girando na borda */}
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 999,
          background: 'conic-gradient(from 0deg, transparent 0deg 260deg, rgba(37,211,102,.35) 295deg, #25D366 318deg, rgba(37,211,102,.35) 335deg, transparent 360deg)',
          animation: 'wa-saber-ring 8s linear infinite',
          opacity: hovered ? 0 : 1,
          transition: 'opacity .2s ease',
          pointerEvents: 'none',
        }}/>
        {/* Fundo interior (deixa só o anel 2px visível) */}
        <span style={{
          position: 'absolute', inset: 2, borderRadius: 999,
          background: hovered ? '#25D366' : 'var(--bg)',
          transition: 'background .25s ease',
          pointerEvents: 'none',
        }}/>
        <span style={{ position: 'relative', zIndex: 1 }}>WhatsApp</span>
      </a>
      <style>{`@keyframes wa-saber-ring { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </>
  );
}

function Nav() {
  const tema = () => document.documentElement.getAttribute('data-theme') || 'dark';
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="logo" href="#top">
          <img src="brava-logo-white.png" alt="Brava Company" style={{ height: 17, objectFit: 'contain' }} />
        </a>
        <div className="nav-links">
          <a href="#solucao">Plataforma</a>
          <a href="#planos">Planos</a>
          <a href="#prova">Clientes</a>
          <a href="#faq">Perguntas</a>
          {/* WhatsApp — ghost + saber verde na borda, hover pinta inteiro */}
          <WaBtn href={WA_LINK} />
          <a className="btn btn-sm" href={`/app/?login=1&theme=${tema()}`}
             style={{ background:'#1E90FF', color:'#fff', boxShadow:'0 4px 14px rgba(30,144,255,.35)' }}>
            Entrar
          </a>
        </div>
      </div>
    </nav>
  );
}

const HEADLINES = {
  A: {
    h1: <>Pare de perder venda no <span className="gradient-text">WhatsApp bagunçado</span>.</>,
    sub: 'Tenha agentes de IA treinados pra responder, vender e organizar tudo no seu lugar, com seu logo, suas regras e seu time no comando.'
  },
  B: {
    h1: <>O WhatsApp da sua empresa virou uma <span className="gradient-text">fábrica de venda perdida</span>?</>,
    sub: 'A Brava transforma ele num sistema com seu logo, suas regras e agentes de IA configurados pelo seu time.'
  },
  C: {
    h1: <>Pare de juntar agência, CRM, automação e <span className="gradient-text">suporte</span>.</>,
    sub: 'A Brava é o setor de tecnologia integrado da sua empresa: site, CRM, agentes de IA e suporte. Tudo num só parceiro, com seu logo.'
  }
};

const CTAS = {
  A: { btn: 'Falar com um especialista', meta: 'Resposta em até 30 minutos no horário comercial · Sem compromisso' },
  B: { btn: 'Quero ver a plataforma funcionando', meta: 'Demonstração ao vivo · 30 minutos · Sem cartão de crédito' }
};

const WA_LINK = 'https://wa.me/5511991612610?text=Ol%C3%A1!%20Vim%20pela%20LP%20da%20Brava%20e%20quero%20conhecer%20a%20plataforma';

function Hero({ headline, cta, accents }) {
  const H = HEADLINES[headline] || HEADLINES.A;
  const C = CTAS[cta] || CTAS.A;
  return (
    <section className="hero section dark" id="top">
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
            <h1 className="h1">
              <span style={{ display: 'block' }}>Tenha uma plataforma</span>
              <span className="gradient-text" style={{ display: 'block' }}>para atendimento e venda com IA</span>
            </h1>
            <p className="lead hero-sub" style={{ whiteSpace: 'pre-line' }}>
              {'Arquitetura com múltiplos funcionários de IA pra atender,\nvender e organizar tudo em um só lugar\ncom seu logo, cores e sua equipe'}
            </p>
            <div className="hero-cta">
              <a href={WA_LINK} className="btn btn-primary">
                Falar com um especialista
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <a href="#planos" className="btn btn-ghost">Ver planos</a>
            </div>
          </div>
          <CRMMockup />
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
window.Nav = Nav;
window.WA_LINK = WA_LINK;
window.HEADLINES = HEADLINES;
window.CTAS = CTAS;
