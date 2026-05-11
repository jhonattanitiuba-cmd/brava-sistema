// Brava design system primitives. Reads CSS vars from :root.
// All components support dark/light via CSS vars (no JS branching).

const Logo = ({ size = 48, mode = 'gradient', style = {} }) => {
  // Real BRAVA wordmark, rendered via CSS mask so color follows currentColor / gradient.
  // Aspect ratio of source PNG: 3073 / 598 ≈ 5.14
  const ratio = 3073 / 598;
  const height = size;
  const width = Math.round(size * ratio);
  const bg = mode === 'gradient' ? 'var(--brava-grad)' : 'currentColor';
  return (
    <span
      className={`bv-logo bv-logo--${mode}`}
      role="img"
      aria-label="BRAVA"
      style={{
        display: 'inline-block',
        width, height,
        background: bg,
        WebkitMask: 'var(--brava-logo-mask)',
        mask: 'var(--brava-logo-mask)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        ...style,
      }} />
  );
};

const Button = ({ children, variant = 'primary', size = 'md', icon, iconRight, fullWidth, disabled, loading, onClick, type = 'button', className = '', ...rest }) => {
  const cls = ['bv-btn', `bv-btn--${variant}`, `bv-btn--${size}`, fullWidth ? 'bv-btn--full' : '', loading ? 'bv-btn--loading' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} disabled={disabled || loading} onClick={onClick} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
};

const Input = ({ label, hint, error, icon, type = 'text', value, onChange, placeholder, autoFocus, suffix, id, ...rest }) => {
  const inputId = id || `inp-${label?.replace(/\s/g, '-').toLowerCase() || Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={`bv-field ${error ? 'bv-field--err' : ''}`}>
      {label && <label className="bv-label" htmlFor={inputId}>{label}</label>}
      <div className="bv-input-wrap">
        {icon && <span className="bv-input-icon"><Icon name={icon} size={16} /></span>}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`bv-input ${icon ? 'bv-input--with-icon' : ''} ${suffix ? 'bv-input--with-suffix' : ''}`}
          {...rest}
        />
        {suffix && <span className="bv-input-suffix">{suffix}</span>}
      </div>
      {(hint || error) && <div className={`bv-hint ${error ? 'bv-hint--err' : ''}`}>{error || hint}</div>}
    </div>
  );
};

const Card = ({ children, padded = true, className = '', accent = false, ...rest }) => (
  <div className={`bv-card ${padded ? 'bv-card--pad' : ''} ${accent ? 'bv-card--accent' : ''} ${className}`} {...rest}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral', icon }) => (
  <span className={`bv-badge bv-badge--${variant}`}>
    {icon && <Icon name={icon} size={12} />}
    {children}
  </span>
);

const Avatar = ({ name, size = 32, src, status }) => {
  const initials = (name || '?').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="bv-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
      {status && <span className={`bv-avatar-status bv-avatar-status--${status}`} />}
    </div>
  );
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="bv-toggle">
    <input type="checkbox" checked={checked} onChange={e => onChange?.(e.target.checked)} />
    <span className="bv-toggle-track"><span className="bv-toggle-thumb" /></span>
    {label && <span className="bv-toggle-label">{label}</span>}
  </label>
);

const Divider = ({ label }) => label
  ? <div className="bv-divider bv-divider--label"><span>{label}</span></div>
  : <div className="bv-divider" />;

const StepDots = ({ count, current }) => (
  <div className="bv-stepdots">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className={`bv-stepdot ${i < current ? 'bv-stepdot--done' : ''} ${i === current ? 'bv-stepdot--active' : ''}`} />
    ))}
  </div>
);

Object.assign(window, { Logo, Button, Input, Card, Badge, Avatar, Toggle, Divider, StepDots });
