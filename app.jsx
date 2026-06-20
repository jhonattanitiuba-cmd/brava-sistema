/* global React, ReactDOM, Nav, Hero, Sectors, PainBlock, SocialProof, Plans, FAQ, FinalCTA, PSFooter, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakSelect, ProductShowcase */

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "headline": "A",
  "cta": "A",
  "accents": true,
  "darkMode": "alternating"
}/*EDITMODE-END*/;

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const ThemeToggle = () => {
  const [dark, setDark] = React.useState(true);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };
  return (
    <button onClick={toggle} style={{
      position: 'fixed', top: 16, right: 16, zIndex: 9999,
      width: 40, height: 40, borderRadius: '50%',
      background: dark ? '#1B1B27' : '#fff',
      border: `1px solid ${dark ? '#2A2A3A' : '#D8D8D8'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      color: dark ? '#F5F5F7' : '#0A0A0F',
      transition: 'all .2s',
    }}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULS);

  // Lê tema/logout vindos do SaaS via URL
  React.useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const tema = url.get('theme');
    const logout = url.get('logout') === '1';
    if (tema) document.documentElement.setAttribute('data-theme', tema);
    if (logout) {
      // Banner sutil de "Sessão encerrada"
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;bottom:80px;right:16px;z-index:99999;padding:14px 18px;background:#0E0E14;border:1px solid #2A2A3A;border-left:3px solid #1D9E75;border-radius:10px;color:#F5F5F7;font-size:13.5px;font-family:Inter;box-shadow:0 12px 32px rgba(0,0,0,.4);animation:slideup .3s';
      div.textContent = 'Você saiu da plataforma. Até logo!';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 4000);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Apply override class to body for "all dark" mode
  React.useEffect(() => {
    if (t.darkMode === 'all-dark') {
      document.body.classList.add('force-dark');
    } else {
      document.body.classList.remove('force-dark');
    }
  }, [t.darkMode]);

  // Scroll reveal
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Nav />
      {/* ── Fundo unificado Hero + ProductShowcase ─────────── */}
      <div style={{ position:'relative', overflow:'hidden', background:'#05050D' }}>
        {/* Blob roxo animado lento */}
        <div className="app-glow-blob" style={{
          position:'absolute', top:'-5%', left:'-5%',
          width:'60%', height:'70%',
          background:'radial-gradient(ellipse, rgba(123,63,228,.28) 0%, rgba(123,63,228,.08) 45%, transparent 70%)',
          animation:'bg-blob-a 18s ease-in-out infinite',
          pointerEvents:'none',
        }}/>
        {/* Blob azul animado lento */}
        <div className="app-glow-blob" style={{
          position:'absolute', bottom:'-5%', right:'-5%',
          width:'55%', height:'65%',
          background:'radial-gradient(ellipse, rgba(30,144,255,.22) 0%, rgba(30,144,255,.06) 45%, transparent 70%)',
          animation:'bg-blob-b 22s ease-in-out infinite',
          pointerEvents:'none',
        }}/>
        {/* Blob roxo secundario - centro baixo */}
        <div className="app-glow-blob" style={{
          position:'absolute', bottom:'20%', left:'30%',
          width:'40%', height:'40%',
          background:'radial-gradient(ellipse, rgba(123,63,228,.10) 0%, transparent 70%)',
          animation:'bg-blob-a 28s ease-in-out 6s infinite reverse',
          pointerEvents:'none',
        }}/>
        <style>{`
          @keyframes bg-blob-a {
            0%,100%{ transform:translate(0,0) scale(1); }
            33%    { transform:translate(6%,8%) scale(1.08); }
            66%    { transform:translate(-4%,4%) scale(.94); }
          }
          @keyframes bg-blob-b {
            0%,100%{ transform:translate(0,0) scale(1); }
            40%    { transform:translate(-5%,-6%) scale(1.06); }
            70%    { transform:translate(4%,5%) scale(.96); }
          }
        `}</style>
        <Hero headline={t.headline} cta={t.cta} accents={t.accents} />
        <ProductShowcase />
      </div>
      <Sectors />
      <PainBlock />
      <SocialProof />
      <Plans />
      <FAQ />
      <FinalCTA />
      <PSFooter />
      <footer style={{
        padding: '22px 40px',
        background: '#000000',
        borderTop: '1px solid #1F1F2A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        fontSize: 12.5, color: '#6E6E78', textAlign: 'center',
      }}>
        <span style={{ color: '#F5F5F7', fontWeight: 500, fontSize: 13 }}>
          Brava Company © Todos os direitos reservados · CNPJ 34.454.770/0001-26
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['comercial','financeiro','suporte'].map((dep, i, arr) => (
            <React.Fragment key={dep}>
              <a href={`mailto:${dep}@brava.company`} style={{
                color: '#A0A0AA', fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
                textDecoration: 'none', transition: 'color .15s',
              }}
                onMouseEnter={e => e.target.style.color='#1E90FF'}
                onMouseLeave={e => e.target.style.color='#A0A0AA'}
              >{dep}@brava.company</a>
              {i < arr.length - 1 && <span style={{ color: '#2A2A3A' }}>·</span>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[['Política de Privacidade','#'],['Termos de Uso','#'],['LGPD','#']].map(([label, href], i, arr) => (
            <React.Fragment key={label}>
              <a href={href} style={{ color: '#6E6E78', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.target.style.color='#1E90FF'}
                onMouseLeave={e => e.target.style.color='#6E6E78'}
              >{label}</a>
              {i < arr.length - 1 && <span style={{ color: '#2A2A3A' }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      </footer>

    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
