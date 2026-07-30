// ═══════════════════════════════════════════════════════════════
// BOLA DE NEVE · shell (router + sidebar recolhivel + primitivos de UI)
// Primitivos ficam em window.BN. As telas registram em window.BN_SCREENS.
// Envolto em IIFE para nao vazar nomes (ex.: Icon) pro escopo global.
// ═══════════════════════════════════════════════════════════════

(function () {
const { useState, useEffect, useRef, useCallback, createElement } = React;
const Icon = window.Icon;

// ---- Rotas ----
const ROUTES = ['hub', 'painel', 'acolhimento', 'celulas', 'biblia', 'devocionais', 'baixar', 'cadastro'];
const ROUTE_ALIAS = { baixar: 'captacao', cadastro: 'captacao', hub: 'hub' };

function parseLocation() {
  const parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  let screen = 'hub';
  let baseParts = parts.slice();
  if (ROUTES.includes(last) && last !== 'hub') { screen = last; baseParts = parts.slice(0, -1); }
  const base = '/' + baseParts.join('/') + (baseParts.length ? '/' : '');
  return { screen, base };
}

// ══════════════════════ Primitivos de UI ══════════════════════

function Button({ children, variant = 'default', icon, iconRight, onClick, className = '', style = {}, type = 'button', disabled }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`bn-btn ${variant} ${className}`} style={style}>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={16} />}
    </button>
  );
}

function Chip({ children, dotColor, icon }) {
  return (
    <span className="bn-chip">
      {dotColor && <span style={{ width: 7, height: 7, borderRadius: 999, background: dotColor, boxShadow: `0 0 8px ${dotColor}` }} />}
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

function NucleoDot({ nucleoId, size = 10, glow = true }) {
  const n = window.MOCK.nucleoById[nucleoId];
  const cor = n ? n.cor : 'var(--bn-text-3)';
  return <span style={{ width: size, height: size, borderRadius: 999, background: cor, boxShadow: glow ? `0 0 10px ${cor}` : 'none', flexShrink: 0, display: 'inline-block' }} />;
}

function Card({ children, className = '', hoverable, onClick, style = {}, pad }) {
  return (
    <div onClick={onClick}
      className={`bn-card ${hoverable ? 'hoverable' : ''} ${className}`}
      style={{ ...(pad != null ? { padding: pad } : {}), ...style }}>
      {children}
    </div>
  );
}

function ProgressBar({ value, total, color = 'var(--bn-accent)', height = 6 }) {
  const pct = Math.max(0, Math.min(100, total ? (value / total) * 100 : value));
  return (
    <div style={{ width: '100%', height, borderRadius: 999, background: 'var(--bn-surface-3)', overflow: 'hidden' }}>
      <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: color, transition: 'width var(--dur-slow) var(--ease)' }} />
    </div>
  );
}

function Avatar({ name, size = 38, nucleoId }) {
  const initials = (name || '?').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  const cor = nucleoId && window.MOCK.nucleoById[nucleoId] ? window.MOCK.nucleoById[nucleoId].cor : 'var(--bn-accent)';
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bn-surface-3)', border: '1px solid var(--bn-border)',
      color: cor, fontWeight: 'var(--fw-strong)', fontSize: size * 0.36, letterSpacing: '0.02em',
    }}>{initials}</div>
  );
}

// ---- Contador animado (cascata) ----
function StatCounter({ value, duration = 1500, delay = 0, decimals = 0, prefix = '', suffix = '', className = '', style = {} }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf, startT;
    const startTimer = setTimeout(() => {
      const step = (t) => {
        if (!startT) startT = t;
        const p = Math.min(1, (t - startT) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(step);
        else setDisplay(value);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(startTimer); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration, delay]);
  const shown = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('pt-BR');
  return <span ref={ref} className={`bn-num ${className}`} style={style}>{prefix}{shown}{suffix}</span>;
}

// ---- Entrada de tela (stagger) ----
function Screen({ children, className = '' }) {
  return <div className={`bn-screen ${className}`}>{children}</div>;
}

function SectionTitle({ eyebrow, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--sp-4)', flexWrap: 'wrap', marginBottom: 'var(--sp-5)' }}>
      <div>
        {eyebrow && <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-3)' }}><span className="dot" />{eyebrow}</div>}
        <h2 className="bn-h2">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function Field({ label, icon, type = 'text', value, onChange, placeholder, autoFocus }) {
  return (
    <label style={{ display: 'block' }}>
      {label && <span className="bn-sm bn-muted" style={{ display: 'block', marginBottom: 'var(--sp-2)', fontWeight: 'var(--fw-medium)' }}>{label}</span>}
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', padding: '12px 14px', borderRadius: 'var(--r-sm)', background: 'var(--bn-bg-2)', border: '1px solid var(--bn-border)' }}>
        {icon && <Icon name={icon} size={17} style={{ color: 'var(--bn-text-3)' }} />}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--bn-text)', fontSize: 'var(--fs-body)', fontFamily: 'var(--bn-font)' }} />
      </span>
    </label>
  );
}

window.BN = { Button, Chip, NucleoDot, Card, ProgressBar, Avatar, StatCounter, Screen, SectionTitle, Field, Icon };

// ══════════════════════ Sidebar ══════════════════════

function Sidebar({ screen, base, navigate, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const items = window.MOCK.ambientes;
  const go = (rota) => { navigate(rota); setMobileOpen(false); };

  return (
    <aside className={`bn-sidebar ${collapsed ? 'mini' : ''} ${mobileOpen ? 'open' : ''}`}>
      <div className="bn-side-brand" onClick={() => go('hub')} role="button">
        <img className="bn-mark-img" src="/bolaneve/assets/emblem-white.png" alt="Bola de Neve Church" width="38" height="38" />
        {!collapsed && (
          <span className="bn-brandtext">
            <strong>Bola de Neve</strong>
            <em>Sorocaba</em>
          </span>
        )}
      </div>

      <nav className="bn-nav">
        {items.map((it, i) => (
          <button key={it.id}
            className={`bn-navitem ${screen === it.rota ? 'active' : ''}`}
            style={{ animationDelay: (80 + i * 55) + 'ms' }}
            onClick={() => go(it.rota)}
            title={it.nome}>
            <Icon name={it.icon} size={19} />
            {!collapsed && <span>{it.nome}</span>}
            {!collapsed && screen === it.rota && <span className="bn-nav-rail" />}
          </button>
        ))}
      </nav>

      <div className="bn-side-foot">
        <button className="bn-navitem" style={{ animationDelay: '460ms' }} onClick={() => go('baixar')} title="Baixar o app">
          <Icon name="Download" size={19} />
          {!collapsed && <span>Baixar o app</span>}
        </button>
        <button className="bn-navitem bn-collapse" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expandir' : 'Recolher'}>
          <Icon name={collapsed ? 'ChevronsRight' : 'ChevronsLeft'} size={19} />
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}

// ══════════════════════ Topbar ══════════════════════

function Topbar({ screen, navigate, setMobileOpen, muted, setMuted }) {
  const amb = window.MOCK.ambientes.find(a => a.rota === screen);
  const title = amb ? amb.nome : (screen === 'baixar' || screen === 'cadastro' ? 'Baixar' : 'Ecossistema');
  return (
    <header className="bn-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <button className="bn-icon-btn bn-only-mobile" onClick={() => setMobileOpen(true)} title="Menu"><Icon name="Menu" size={20} /></button>
        <div>
          <div className="bn-eyebrow"><span className="dot" />{window.MOCK.igreja.cidade}</div>
          <div className="bn-h3" style={{ marginTop: 2 }}>{title}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        <button className="bn-icon-btn" title={muted ? 'Ativar som' : 'Silenciar'} onClick={() => setMuted(m => { window.BNRatchet.setMuted(!m); return !m; })}>
          <Icon name={muted ? 'Volume2' : 'Volume2'} size={18} style={{ opacity: muted ? 0.4 : 1 }} />
        </button>
        <button className="bn-icon-btn" title="Notificacoes"><Icon name="Bell" size={18} /></button>
        <div className="bn-topuser">
          <Avatar name={window.MOCK.igreja.pastor} size={34} />
          <div className="bn-only-desktop">
            <div className="bn-sm" style={{ fontWeight: 'var(--fw-strong)', lineHeight: 1.1 }}>{window.MOCK.igreja.pastor}</div>
            <div className="bn-sm bn-faint" style={{ fontSize: 'var(--fs-xs)' }}>Lideranca</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ══════════════════════ App ══════════════════════

function App() {
  const [{ screen, base }, setLoc] = useState(parseLocation());
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [muted, setMutedState] = useState(false);

  const navigate = useCallback((rota) => {
    const cur = parseLocation();
    const path = cur.base + (rota === 'hub' ? '' : rota);
    try { history.pushState({ rota }, '', path); } catch (e) { /* file:// fallback */ }
    setLoc({ screen: rota === 'hub' ? 'hub' : rota, base: cur.base });
    const main = document.querySelector('.bn-main-scroll');
    if (main) main.scrollTop = 0;
  }, []);

  useEffect(() => {
    const onPop = () => setLoc(parseLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setMuted = (fn) => setMutedState(fn);

  const screenKey = ROUTE_ALIAS[screen] || screen;
  const ScreenComp = (window.BN_SCREENS || {})[screenKey] || (window.BN_SCREENS || {}).hub;

  return (
    <div className={`bn-app ${collapsed ? 'mini' : ''}`}>
      {mobileOpen && <div className="bn-scrim" onClick={() => setMobileOpen(false)} />}
      <Sidebar screen={screen} base={base} navigate={navigate}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="bn-frame">
        <Topbar screen={screen} navigate={navigate} setMobileOpen={setMobileOpen} muted={muted} setMuted={setMuted} />
        <main className="bn-main-scroll">
          <div className="bn-main" key={screenKey}>
            {ScreenComp ? createElement(ScreenComp, { navigate }) : <div style={{ padding: 40 }}>Tela nao encontrada.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}

window.BN_App = App;
})();
