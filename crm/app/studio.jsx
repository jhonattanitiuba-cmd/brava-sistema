/* Brava Studio de Implementação — 7 telas
   Welcome → Identity → WhatsApp → Team → AI → Preparing → Ready
*/

const { useState, useEffect, useMemo, useRef } = React;

/* ──────────────────────────────────────────────────────────
   Step model (used by progress bar and rail)
   ────────────────────────────────────────────────────────── */
const STEPS = [
{ key: 'identity', label: '1. Identidade visual', sub: 'Logo, cor, nome', icon: 'Palette' },
{ key: 'whatsapp', label: '2. Conectar WhatsApp', sub: 'Onde a mágica acontece', icon: 'Smartphone' },
{ key: 'team', label: '3. Cadastrar Equipe', sub: 'Quem vai atender', icon: 'Users' },
{ key: 'ai', label: '4. Treinar Agente IA', sub: 'Personalização do atendimento', icon: 'Sparkles' }];


/* ──────────────────────────────────────────────────────────
   Top bar — progress + autosave + workspace pill
   ────────────────────────────────────────────────────────── */
function StudioTop({ stepIdx, totalSteps, autosaved, hideProgress }) {
  return (
    <header className="st-top" style={{ backgroundColor: "rgb(240, 240, 240)" }}>
      <div className="st-top__brand">
        <Logo size={22} />
      </div>
      {!hideProgress &&
      <div className="st-top__progress" aria-label={`Etapa ${stepIdx + 1} de ${totalSteps}`}>
          <span className="st-top__count">Etapa {String(stepIdx + 1).padStart(2, '0')} de {String(totalSteps).padStart(2, '0')}</span>
          <div className="st-top__bar"><div style={{ width: `${(stepIdx + 1) / totalSteps * 100}%` }} /></div>
        </div>
      }
      <div className="st-top__right">
        <span className={`st-saving ${autosaved ? 'st-saving--ok' : ''}`}>
          <Icon name={autosaved ? 'Check' : 'Clock'} size={13} />
          {autosaved ? 'Salvo automaticamente' : 'Salvando…'}
        </span>
        <span className="st-top__url">implementacao.brava.software</span>
      </div>
    </header>);

}

/* ──────────────────────────────────────────────────────────
   1 — Welcome
   ────────────────────────────────────────────────────────── */
function WelcomeScreen({ onStart, customerName }) {
  return (
    <main className="st-welcome">
      <div className="st-welcome__halo" aria-hidden="true" />
      <div className="st-welcome__inner">
        <h1 className="st-welcome__h" style={{ fontSize: "45px" }}>
          Bem-vindo à Brava Company. <span className="grad-text" style={{ fontSize: "45px" }}></span>
        </h1>
        <p className="st-welcome__lead" style={{ fontSize: "15px" }}>
          Sua jornada com nossa tecnologia integrada começa aqui. Nas próximas etapas, vamos personalizar o sistema para a sua empresa. 

          <strong>

Leva de 15 a 30 minutos</strong>.
        </p>

        <ol className="st-welcome__steps">
          {STEPS.map((s, i) => <li key={s.key} className="st-welcome__step">
              <span className="st-welcome__stepIco"><Icon name={s.icon} size={18} /></span>
              <div>
                <strong>{s.label}</strong>
                <span>{s.sub}</span>
              </div>
            </li>)}
        </ol>

        <div className="st-welcome__pause">
          <Icon name="Check" size={16} />
          <span>Você pode pausar a qualquer momento. Salvamos tudo automaticamente.</span>
        </div>

        <div className="st-welcome__cta">
          <Button variant="primary" size="lg" iconRight="ArrowRight" onClick={onStart}>
            Começar agora
          </Button>
          <button className="st-welcome__help" type="button">
            <Icon name="MessageCircle" size={14} />
            Gostaria de agendar a implementação guiada
          </button>
        </div>
      </div>
    </main>);

}

/* ──────────────────────────────────────────────────────────
   Step shell — title + body + footer (continue / back)
   ────────────────────────────────────────────────────────── */
function StepShell({ eyebrow, title, lead, children, onBack, onNext, nextLabel = 'Continuar', nextDisabled, secondary }) {
  return (
    <main className="st-step">
      <div className="st-step__inner">
        <div className="st-step__head">
          <span className="st-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
        </div>
        <div className="st-step__body">{children}</div>
      </div>
      <footer className="st-step__foot">
        <div className="st-step__foot-left">
          {onBack &&
          <Button variant="ghost" icon="ArrowLeft" onClick={onBack}>Voltar</Button>
          }
        </div>
        <div className="st-step__foot-right">
          {secondary}
          <Button variant="primary" iconRight="ArrowRight" disabled={nextDisabled} onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      </footer>
    </main>);

}

/* ──────────────────────────────────────────────────────────
   2 — Identity (logo, slug, color) with live preview
   ────────────────────────────────────────────────────────── */
const COLOR_PRESETS = [
{ name: 'Roxo Brava', hex: '#7B3FE4' },
{ name: 'Oceano', hex: '#1E90FF' },
{ name: 'Esmeralda', hex: '#1D9E75' },
{ name: 'Carmim', hex: '#A32D2D' },
{ name: 'Âmbar', hex: '#BA7517' },
{ name: 'Grafite', hex: '#2A2A3A' }];


function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(value || '');
  const popRef = useRef(null);
  const triggerRef = useRef(null);
  const hasEyedropper = typeof window !== 'undefined' && !!window.EyeDropper;

  useEffect(() => {setHexDraft(value || '');}, [value]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const isPreset = COLOR_PRESETS.some((p) => p.hex.toLowerCase() === (value || '').toLowerCase());

  const commitHex = () => {
    const v = (hexDraft || '').trim();
    const m = /^#?([0-9a-fA-F]{6})$/.exec(v);
    if (m) onChange('#' + m[1].toUpperCase());else
    setHexDraft(value || '');
  };

  const useEyedropper = async () => {
    if (!hasEyedropper) return;
    try {
      const ed = new window.EyeDropper();
      const r = await ed.open();
      onChange(r.sRGBHex.toUpperCase());
    } catch {/* user cancelled */}
  };

  return (
    <div className="onb-cp">
      <div className="onb-cp__row">
        {COLOR_PRESETS.map((p) =>
        <button
          key={p.hex}
          type="button"
          className={`onb-cp__dot ${value === p.hex ? 'onb-cp__dot--on' : ''}`}
          style={{ '--c': p.hex }}
          onClick={() => onChange(p.hex)}
          aria-label={`${p.name} ${p.hex}`}
          title={`${p.name} · ${p.hex}`} />
        )}
        <button
          ref={triggerRef}
          type="button"
          className={`onb-cp__dot onb-cp__dot--custom ${!isPreset && value ? 'onb-cp__dot--on' : ''}`}
          style={!isPreset && value ? { '--c': value } : {}}
          onClick={() => setOpen((o) => !o)}
          aria-label="Cor personalizada"
          title="Cor personalizada">
          {(isPreset || !value) && <span className="onb-cp__plus">+</span>}
        </button>
        <span className="onb-cp__current">
          <span className="onb-cp__current-sw" style={{ background: value || '#000' }} />
          <code>{(value || '').toUpperCase()}</code>
        </span>
      </div>

      {open &&
      <div className="onb-cp__pop" ref={popRef}>
          <div className="onb-cp__pop-head">
            <span>Cor personalizada</span>
            <button type="button" className="onb-cp__close" onClick={() => setOpen(false)} aria-label="Fechar">
              <Icon name="X" size={14} />
            </button>
          </div>
          <div className="onb-cp__pop-body">
            <label className="onb-cp__field onb-cp__field--rgb">
              <span>Painel RGB</span>
              <span className="onb-cp__rgbwrap">
                <span className="onb-cp__rgbsw" style={{ background: value || '#000' }} />
                <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                className="onb-cp__native" />
              </span>
            </label>
            <label className="onb-cp__field">
              <span>Hex</span>
              <input
              type="text"
              className="onb-cp__hex"
              value={hexDraft}
              onChange={(e) => setHexDraft(e.target.value)}
              onBlur={commitHex}
              onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();commitHex();}}}
              placeholder="#7B3FE4"
              spellCheck={false}
              maxLength={7} />
            </label>
            {hasEyedropper &&
          <button type="button" className="onb-cp__ed" onClick={useEyedropper} title="Conta-gotas" aria-label="Conta-gotas">
                <Icon name="Pipette" size={16} />
              </button>
          }
          </div>
          <div className="onb-cp__pop-meta">
            {hasEyedropper ?
          'Use o painel, cole um código hex ou capture uma cor da tela com o conta-gotas.' :
          'Use o painel ou cole um código hex (#RRGGBB).'}
          </div>
        </div>
      }
    </div>);
}


function IdentityStep({ data, setData, onBack, onNext }) {
  const [slugStatus, setSlugStatus] = useState('ok'); // 'ok' | 'checking' | 'taken'
  const slug = data.slug || '';

  useEffect(() => {
    if (!slug) return;
    setSlugStatus('checking');
    const t = setTimeout(() => {
      setSlugStatus(slug === 'brava' || slug === 'admin' || slug === 'app' ? 'taken' : 'ok');
    }, 500);
    return () => clearTimeout(t);
  }, [slug]);

  const initials = (data.name || 'WS').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const accent = data.color || '#7B3FE4';

  return (
    <StepShell
      eyebrow="Etapa 1/4"
      title="Vamos inserir a identidade da sua marca."
      lead="Em segundos, o sistema já fica com a identidade da sua empresa."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!data.name || !slug || slugStatus !== 'ok'}>
      
      <div className="st-identity">
        <div className="st-identity__form">
          <Input
            label="Nome da sua empresa"
            placeholder="ex: Clínica Bem Estar"
            value={data.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })} />
          

          <div className="bv-field">
            <label className="bv-label">Endereço da plataforma</label>
            <div className="bv-input-wrap">
              <input
                className="bv-input bv-input--with-suffix"
                value={slug}
                onChange={(e) => setData({ ...data, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="clinicabemestar" />
              
              <span className="bv-input-suffix">.brava.software</span>
            </div>
            <div className={`bv-hint ${slugStatus === 'taken' ? 'bv-hint--err' : ''}`}>
              {slugStatus === 'checking' && <span><Icon name="Clock" size={12} /> verificando disponibilidade…</span>}
              {slugStatus === 'ok' && slug && <span style={{ color: 'var(--success)' }}><Icon name="Check" size={12} /> {slug}.brava.software está disponível</span>}
              {slugStatus === 'taken' && <span><Icon name="AlertCircle" size={12} /> esse endereço já está em uso</span>}
              {!slug && 'Esse será o endereço onde sua equipe acessa o sistema.'}
            </div>
          </div>

          <div className="bv-field">
            <label className="bv-label">Logo da empresa</label>
            <div className={`onb-upload ${data.logoLoaded ? 'onb-upload--filled' : ''}`} onClick={() => setData({ ...data, logoLoaded: !data.logoLoaded })}>
              {data.logoLoaded ?
              <>
                  <span className="onb-upload__preview" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>{initials}</span>
                  <div className="onb-upload__meta">
                    <strong>logo-{slug || 'workspace'}.svg</strong>
                    <span>SVG · 2.4 KB · trocar arquivo</span>
                  </div>
                </> :

              <>
                  <span className="onb-upload__icon"><Icon name="Upload" size={22} /></span>
                  <div className="onb-upload__meta">
                    <strong>Arraste sua logo ou clique para enviar</strong>
                    <span>PNG ou SVG, até 2MB. Ideal: 512×512px.</span>
                  </div>
                </>
              }
            </div>
          </div>

          <div className="bv-field">
            <label className="bv-label">Cor principal da marca</label>
            <ColorPicker value={accent} onChange={(hex) => setData({ ...data, color: hex })} />
            <div className="bv-hint">Escolheu uma cor com baixo contraste? Ajustamos automaticamente para manter a leitura confortável.</div>
          </div>
        </div>

        <aside className="st-preview">
          <div className="onb-preview__tag">Pré-visualização ao vivo</div>
          <div className="onb-preview__chrome">
            <div className="onb-preview__sb">
              <div className="onb-preview__ws">
                <span className="onb-preview__avatar" style={{ background: data.color === '#7B3FE4' ? 'var(--brava-grad)' : accent }}>{initials}</span>
                <div>
                  <strong>{data.name || 'Seu workspace'}</strong>
                  <span>{slug || 'workspace'}.brava.software</span>
                </div>
              </div>
              <div className="onb-preview__nav onb-preview__nav--on" style={{ background: data.color === '#7B3FE4' ? 'var(--brava-grad)' : accent }}>
                <Icon name="LayoutDashboard" size={13} /> Dashboard
              </div>
              {['Conversas', 'Pipeline', 'Analytics', 'Contatos'].map((l) =>
              <div key={l} className="onb-preview__nav">
                  <Icon name={{ Conversas: 'MessageCircle', Pipeline: 'KanbanSquare', Analytics: 'BarChart3', Contatos: 'Users' }[l]} size={13} /> {l}
                </div>
              )}
              <div className="onb-preview__sep" />
              <div className="onb-preview__nav">
                <Icon name="Headphones" size={13} /> Suporte
              </div>
              <div className="onb-preview__nav">
                <Icon name="Settings" size={13} /> Configurações
              </div>
            </div>
            <div className="onb-preview__main">
              <div className="onb-preview__bar"><span /><span /></div>
              <div className="onb-preview__rows">
                {[1, 2, 3, 4].map((i) =>
                <div key={i} className="onb-preview__row">
                    <span /><span style={{ background: i === 1 ? accent : 'var(--border)', opacity: i === 1 ? 0.6 : 1 }} /><span />
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="st-preview__cap">Assim que você muda a cor ou o nome, o sistema atualiza em tempo real. <em>É exatamente como vai ficar.</em></p>
        </aside>
      </div>
    </StepShell>);

}

/* ──────────────────────────────────────────────────────────
   3 — WhatsApp connect (mode picker + QR)
   ────────────────────────────────────────────────────────── */
function WhatsappStep({ data, setData, onBack, onNext }) {
  const [mode, setMode] = useState(data.waMode || null);
  const [scanned, setScanned] = useState(data.waConnected || false);

  useEffect(() => {setData({ ...data, waMode: mode }); /* eslint-disable-next-line */}, [mode]);

  return (
    <StepShell
      eyebrow="Etapa 2/4"
      title="Conecte seu WhatsApp"
      lead="É por aqui que toda a mágica acontece."
      onBack={onBack}
      onNext={() => {setData({ ...data, waMode: mode, waConnected: scanned });onNext();}}
      secondary={!scanned && mode &&
      <Button variant="ghost" onClick={onNext}>Pular por agora</Button>
      }>
      
      {!mode &&
      <div className="onb-grid-2">
          <button className="onb-mode" onClick={() => setMode('quick')} type="button">
            <div className="onb-mode__head">
              <span className="onb-mode__ico"><Icon name="QrCode" size={20} /></span>
              <Badge variant="brand">Recomendado para começar</Badge>
            </div>
            <strong>Número comum</strong>
            <p>Funciona com qualquer WhatsApp. Conexão por QR Code, igual o WhatsApp Web. Pronto em ~2 minutos.</p>
            <div className="st-mode__feet">
              <Icon name="Clock" size={14} /> ~2 min
            </div>
          </button>

          <button className="onb-mode" onClick={() => setMode('cloud')} type="button">
            <div className="onb-mode__head">
              <span className="onb-mode__ico"><Icon name="Building2" size={20} /></span>
              <Badge variant="info">Empresas médias e grandes</Badge>
            </div>
            <strong>Número oficial Meta</strong>
            <p>Cloud API oficial da Meta. Maior estabilidade para volume alto. Requer cadastro Meta.</p>
            <div className="st-mode__feet">
              <Icon name="Clock" size={14} /> ~10 min
            </div>
          </button>
        </div>
      }

      {mode === 'quick' &&
      <div className="onb-qr">
          <div className={`onb-qr__panel ${scanned ? 'onb-qr__panel--scanned' : ''}`}>
            {scanned ?
          <div className="onb-qr__success">
                <span className="onb-qr__check"><Icon name="Check" size={36} /></span>
                <strong>Conectado</strong>
                <span>+55 11 9 ••••-3401 · WhatsApp Brava</span>
              </div> :

          <div className="onb-qr__code">
                <span className="onb-qr__pulse" />
                <QrSvg size={200} seed="brava-studio" />
              </div>
          }
          </div>
          <div className="onb-qr__how">
            <strong>Aguardando conexão…</strong>
            <ol className="onb-qr__steps">
              <li><span>1</span><div>Abra o <strong>WhatsApp</strong> no seu celular.</div></li>
              <li><span>2</span><div>Toque em <strong>Mais opções</strong> ou <strong>Configurações</strong> e depois em <strong>Aparelhos conectados</strong>.</div></li>
              <li><span>3</span><div>Toque em <strong>Conectar aparelho</strong> e aponte a câmera para o QR Code.</div></li>
            </ol>
            <button className="onb-qr__sim" onClick={() => setScanned((s) => !s)} type="button">
              <span><Icon name="Sparkles" size={13} /> simulação:</span>
              <span>{scanned ? 'desfazer scan' : 'simular scan do QR'}</span>
            </button>
            <button className="auth-link" onClick={() => setMode(null)} type="button" style={{ textAlign: 'left' }}>
              ← trocar tipo de conexão
            </button>
          </div>
        </div>
      }

      {mode === 'cloud' &&
      <div className="st-cloud">
          <div className="st-cloud__warn">
            <Icon name="Info" size={18} />
            <div>
              <strong>Esse caminho é mais técnico.</strong>
              <p>Você precisa ter uma conta Meta Business verificada. Se preferir, podemos cuidar disso pra você via chamado de suporte.</p>
            </div>
          </div>
          <div className="st-cloud__actions">
            <Button variant="primary" icon="LifeBuoy" onClick={onNext}>Quero ajuda da Brava</Button>
            <Button variant="outline" onClick={onNext}>Continuar mesmo assim</Button>
            <button className="auth-link" onClick={() => setMode(null)} type="button">← trocar tipo de conexão</button>
          </div>
        </div>
      }
    </StepShell>);

}

/* small generated QR-ish glyph */
function QrSvg({ size = 200, seed = 'brava' }) {
  const cells = useMemo(() => {
    const N = 21;
    let s = 0;
    for (const c of seed) s = s * 31 + c.charCodeAt(0) | 0;
    const rand = () => {s = (s * 9301 + 49297) % 233280;return s / 233280;};
    const grid = Array.from({ length: N }, () => Array.from({ length: N }, () => rand() > 0.55 ? 1 : 0));
    // finder patterns 7x7 in three corners
    const drawFinder = (r, c) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const onEdge = y === 0 || y === 6 || x === 0 || x === 6;
        const onInner = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        grid[r + y][c + x] = onEdge || onInner ? 1 : 0;
      }
    };
    drawFinder(0, 0);drawFinder(0, N - 7);drawFinder(N - 7, 0);
    return grid;
  }, [seed]);
  const cell = size / cells.length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells.length} ${cells.length}`} style={{ background: '#fff', borderRadius: 8, padding: 6, boxSizing: 'content-box' }}>
      {cells.flatMap((row, r) => row.map((v, c) => v ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0A0A0F" /> : null))}
    </svg>);

}

/* ──────────────────────────────────────────────────────────
   4 — Team (admin, members, plan limit bar)
   ────────────────────────────────────────────────────────── */
function TeamStep({ data, setData, onBack, onNext, customer }) {
  const members = data.members || [{ name: customer?.name || 'Você', email: customer?.email || 'voce@empresa.com', role: 'admin', isOwner: true }];
  const planLimit = 10;

  const update = (i, patch) => {
    const m = members.slice();m[i] = { ...m[i], ...patch };
    setData({ ...data, members: m });
  };
  const remove = (i) => setData({ ...data, members: members.filter((_, idx) => idx !== i) });
  const add = () => setData({ ...data, members: [...members, { name: '', email: '', role: 'agent' }] });

  return (
    <StepShell
      eyebrow="Etapa 3/4"
      title="Quem vai atender com você?"
      lead="Adicione as pessoas que vão usar a plataforma. Cada uma recebe um convite por email."
      onBack={onBack}
      onNext={onNext}>
      
      <div className="onb-roles">
        <div className="onb-role">
          <span className="onb-role__ic"><Icon name="UsersRound" size={16} /></span>
          <strong>Administrador</strong>
          <p>Vê tudo, configura o sistema, gerencia equipe e cobrança.</p>
        </div>
        <div className="onb-role">
          <span className="onb-role__ic"><Icon name="MessageCircle" size={16} /></span>
          <strong>Atendente</strong>
          <p>Atende conversas, gerencia pipeline e contatos. Sem acesso a configurações sensíveis.</p>
        </div>
        <div className="onb-role">
          <span className="onb-role__ic"><Icon name="Eye" size={16} /></span>
          <strong>Observador</strong>
          <p>Só leitura. Útil para gestores ou consultores que acompanham operação.</p>
        </div>
      </div>

      <div className="onb-team__limit">
        <div><Icon name="Users" size={14} /> Plano Performance</div>
        <div>
          <div className="onb-team__bar"><div style={{ width: `${members.length / planLimit * 100}%` }} /></div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--text-2)' }}>
          {members.length} de {planLimit} atendentes
        </div>
      </div>

      <div className="onb-team">
        <div className="onb-team__head">
          <div>Nome e email</div>
          <div>Função</div>
          <div></div>
        </div>
        {members.map((m, i) =>
        <div key={i} className="onb-team__row">
            <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
              <input className="bv-input" placeholder="Nome" value={m.name} onChange={(e) => update(i, { name: e.target.value })} disabled={m.isOwner} />
              <input className="bv-input" placeholder="email@empresa.com" value={m.email} onChange={(e) => update(i, { email: e.target.value })} disabled={m.isOwner} />
            </div>
            <select className="onb-select" value={m.role} onChange={(e) => update(i, { role: e.target.value })}>
              <option value="admin">Administrador</option>
              <option value="agent">Atendente</option>
              <option value="viewer">Observador</option>
            </select>
            <button className="onb-team__rm" disabled={m.isOwner} onClick={() => remove(i)} title={m.isOwner ? 'Você é o administrador da conta' : 'Remover'}>
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        )}

        <button className="onb-team__add" onClick={add} disabled={members.length >= planLimit}>
          <Icon name="Plus" size={14} /> Adicionar pessoa
        </button>
      </div>

      <div className="st-help">
        <Icon name="Info" size={16} />
        <p>Os convites <strong>só serão enviados quando você concluir as 4 etapas</strong> e a Brava aprovar — assim ninguém cai num sistema vazio.</p>
      </div>
    </StepShell>);

}

/* ──────────────────────────────────────────────────────────
   5 — AI training
   ────────────────────────────────────────────────────────── */
const TONES = [
{ key: 'formal', label: 'Formal e profissional', sample: '"Prezado cliente, agradecemos seu contato."' },
{ key: 'casual', label: 'Casual e próximo', sample: '"Oi! Tudo bem? Como posso ajudar?"' },
{ key: 'tech', label: 'Técnico e direto', sample: '"Para realizar o orçamento, envie..."' },
{ key: 'fun', label: 'Descontraído', sample: '"E aí! Bora resolver isso juntos?"' }];


const CAN_TOPICS = [
'Horário de atendimento',
'Endereço e localização',
'Formas de pagamento aceitas',
'Preços dos principais serviços',
'Prazo de entrega ou execução',
'Como funciona o agendamento',
'Política de troca ou cancelamento'];

const ESCALATE_TOPICS = [
'Negociação de preço ou desconto',
'Reclamações e problemas',
'Pedidos personalizados ou orçamentos complexos',
'Marcação de reunião ou visita técnica',
'Cliente irritado ou em crise'];


function AIStep({ data, setData, onBack, onFinish }) {
  const ai = data.ai || {};
  const update = (patch) => setData({ ...data, ai: { ...ai, ...patch } });
  const toggleSet = (key, value) => {
    const set = new Set(ai[key] || []);
    set.has(value) ? set.delete(value) : set.add(value);
    update({ [key]: [...set] });
  };

  // Score "context completeness"
  const score = useMemo(() => {
    let s = 0;
    if ((ai.about || '').length > 30) s += 25;
    if (ai.tone) s += 15;
    if ((ai.canDo || []).length >= 3) s += 20;
    if ((ai.canDo || []).length >= 6) s += 5;
    if ((ai.escalate || []).length >= 2) s += 15;
    if ((ai.greeting || '').length > 15) s += 15;
    if ((ai.avoid || '').length > 5) s += 5;
    return Math.min(s, 100);
  }, [ai]);

  return (
    <StepShell
      eyebrow="Etapa 4/4"
      title="Vamos ensinar a IA a falar como sua empresa"
      lead="Quanto mais detalhes você der, melhor o agente vai responder seus clientes. Não se preocupe em dar todas as respostas perfeitas agora — nossa equipe revisa antes de ativar."
      onBack={onBack}
      onNext={onFinish}
      nextLabel="Concluir">
      
      <div className="st-ai">
        <div className="st-ai__form">
          <div className="onb-block">
            <div className="onb-block__title">A · Sobre o que sua empresa faz</div>
            <textarea
              className="onb-textarea" rows={3}
              placeholder="Atendemos pets em São Paulo, com banho, tosa e veterinária. Atendimento de segunda a sábado, 8h às 18h."
              value={ai.about || ''}
              onChange={(e) => update({ about: e.target.value })} />
            
          </div>

          <div className="onb-block">
            <div className="onb-block__title">B · Tom de voz</div>
            <div className="onb-tone" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {TONES.map((t) =>
              <label key={t.key} className={`onb-tone__opt ${ai.tone === t.key ? 'onb-tone__opt--on' : ''}`}>
                  <input type="radio" name="tone" checked={ai.tone === t.key} onChange={() => update({ tone: t.key })} />
                  <strong>{t.label}</strong>
                  <span>{t.sample}</span>
                </label>
              )}
            </div>
          </div>

          <div className="onb-block">
            <div className="onb-block__title">C · O que o agente PODE responder sozinho</div>
            <div className="st-checks">
              {CAN_TOPICS.map((top) =>
              <label key={top} className={`st-check ${(ai.canDo || []).includes(top) ? 'st-check--on' : ''}`}>
                  <span className="st-check__box"><Icon name="Check" size={12} /></span>
                  <input type="checkbox" checked={(ai.canDo || []).includes(top)} onChange={() => toggleSet('canDo', top)} />
                  {top}
                </label>
              )}
            </div>
          </div>

          <div className="onb-block">
            <div className="onb-block__title">D · Quando o agente passa para uma pessoa</div>
            <div className="st-checks">
              {ESCALATE_TOPICS.map((top) =>
              <label key={top} className={`st-check ${(ai.escalate || []).includes(top) ? 'st-check--on' : ''}`}>
                  <span className="st-check__box"><Icon name="Check" size={12} /></span>
                  <input type="checkbox" checked={(ai.escalate || []).includes(top)} onChange={() => toggleSet('escalate', top)} />
                  {top}
                </label>
              )}
            </div>
          </div>

          <div className="onb-block">
            <div className="onb-block__title">E · Saudação inicial</div>
            <textarea
              className="onb-textarea" rows={2}
              placeholder="Olá! Que bom ter você aqui. Sou o assistente da Clínica Bem Estar. Como posso te ajudar hoje?"
              value={ai.greeting || ''}
              onChange={(e) => update({ greeting: e.target.value })} />
            
          </div>

          <div className="onb-block">
            <div className="onb-block__title">F · Palavras a evitar <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(opcional)</span></div>
            <Input
              placeholder="Promoção imperdível, super desconto, oferta relâmpago"
              value={ai.avoid || ''}
              onChange={(e) => update({ avoid: e.target.value })} />
            
          </div>
        </div>

        <aside className="st-ai__side">
          <div className="onb-ai__card">
            <div className="onb-ai__card-head"><Icon name="Sparkles" size={14} /> Pré-visualização do agente</div>
            <div className="onb-ai__chat">
              <div className="onb-ai__msg onb-ai__msg--in">
                <span className="onb-ai__avatar">JM</span>
                <div className="onb-ai__bubble">Oi, vocês atendem aos sábados?</div>
              </div>
              <div className="onb-ai__msg onb-ai__msg--out">
                <span className="onb-ai__avatar onb-ai__avatar--brand">AI</span>
                <div className="onb-ai__bubble onb-ai__bubble--brand">
                  {ai.greeting?.split('!')[0]?.trim() || 'Olá'}! Atendemos sim — sábado, das 8h às 12h. Quer que eu te reserve um horário?
                </div>
              </div>
            </div>
            <div className="onb-ai__meter">
              <div className="onb-ai__meter-head">
                <span>Você forneceu</span>
                <b>{score}%</b>
              </div>
              <div className="onb-ai__meter-bar"><div style={{ width: `${score}%` }} /></div>
              <div className="onb-ai__meter-hint">
                {score < 30 && 'Quanto mais contexto, mais natural o agente fica.'}
                {score >= 30 && score < 70 && 'Bom começo. Continue preenchendo.'}
                {score >= 70 && score < 100 && 'Quase lá. O agente já pode responder com confiança.'}
                {score === 100 && 'Contexto completo. Seu agente vai brilhar.'}
              </div>
            </div>
          </div>

          <div className="onb-ai__hint">
            <Icon name="Info" size={16} />
            <p>Você pode editar tudo isso depois em <code>Configurações → Agente IA</code>. Nada aqui é definitivo.</p>
          </div>
        </aside>
      </div>
    </StepShell>);

}

/* ──────────────────────────────────────────────────────────
   6 — Preparing system
   ────────────────────────────────────────────────────────── */
const PREP_TASKS = [
{ label: 'Aplicando sua identidade visual', ms: 1400 },
{ label: 'Configurando o agente IA com seus dados', ms: 2200 },
{ label: 'Conectando seu canal de WhatsApp', ms: 1800 },
{ label: 'Realizando testes finais', ms: 1600 }];


function PreparingScreen({ onForceReady }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= PREP_TASKS.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), PREP_TASKS[stage].ms);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <main className="st-prep">
      <div className="st-prep__halo" />
      <div className="st-prep__inner">
        <div className="st-prep__pulse">
          <Logo size={56} />
        </div>
        <h1>Estamos preparando seu sistema</h1>
        <p className="st-prep__lead">
          Nossa equipe está revisando suas configurações e ajustando os últimos detalhes.
          Você receberá um email quando tudo estiver pronto.
        </p>
        <div className="st-prep__eta">
          <Icon name="Clock" size={14} />
          <span>Tempo médio: <strong>2 a 4 horas</strong> em horário comercial</span>
        </div>
        <ul className="st-prep__list">
          {PREP_TASKS.map((t, i) => {
            const state = i < stage ? 'done' : i === stage ? 'active' : 'pending';
            return (
              <li key={i} className={`st-prep__item st-prep__item--${state}`}>
                <span className="st-prep__dot">
                  {state === 'done' && <Icon name="Check" size={12} />}
                  {state === 'active' && <span className="st-prep__spin" />}
                </span>
                <span className="st-prep__lbl">{t.label}</span>
              </li>);

          })}
        </ul>
        <p className="st-prep__close">Você pode fechar essa página. Te avisamos por email assim que tudo estiver pronto.</p>
        <div className="st-prep__actions">
          <Button variant="ghost" icon="ArrowLeft" onClick={() => onForceReady('back')}>Voltar</Button>
          <Button variant="outline" iconRight="ArrowRight" onClick={() => onForceReady('ready')}>Pular para "sistema pronto"</Button>
        </div>
      </div>
    </main>);

}

/* ──────────────────────────────────────────────────────────
   7 — System ready
   ────────────────────────────────────────────────────────── */
function ReadyScreen({ data, onRestart }) {
  const slug = data?.slug || 'clinicabemestar';
  const name = data?.name || 'sua empresa';
  const customer = data?.customer || { name: 'Renata', email: 'renata@bemestar.com.br' };
  return (
    <main className="st-ready">
      <div className="st-ready__halo" />
      <div className="st-ready__inner">
        <div className="st-ready__check">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B3FE4" /><stop offset="100%" stopColor="#1E90FF" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#rg)" />
            <path d="M20 33 L29 42 L46 24" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h1>Seu sistema está pronto!</h1>
        <p className="st-ready__lead">Tudo configurado e funcionando.
É hora de começar a atender.</p>

        <div className="st-ready__card">
          <div className="st-ready__row">
            <span className="st-ready__lbl">seudomínio.brava.software

</span>
            <span className="st-ready__val st-ready__val--link">
              <Icon name="Globe" size={14} /> {slug}.brava.software
              <button className="st-ready__copy" type="button" title="Copiar"><Icon name="Copy" size={13} /></button>
            </span>
          </div>
          <div className="st-ready__row">
            <span className="st-ready__lbl">Email de acesso</span>
            <span className="st-ready__val"><Icon name="Mail" size={14} /> {customer.email}</span>
          </div>
          <div className="st-ready__row">
            <span className="st-ready__lbl">Senha</span>
            <span className="st-ready__val"><Icon name="Lock" size={14} /> definida durante o processo</span>
          </div>
          <div className="st-ready__row st-ready__row--note">
            <span className="st-ready__lbl">Empresa</span>
            <span className="st-ready__val">{name}</span>
          </div>
        </div>

        <div className="st-ready__cta">
          <Button variant="primary" size="lg" iconRight="ArrowRight">Acessar meu sistema</Button>
        </div>
        <button className="st-ready__call" type="button">
          <Icon name="MessageCircle" size={14} />
          Quero uma chamada rápida para conhecer o sistema
        </button>

        <div className="st-ready__foot">
          <button className="auth-link" onClick={onRestart} type="button">← Recomeçar a jornada do início</button>
        </div>
      </div>
    </main>);}
/* ──────────────────────────────────────────────────────────
   App container — manages screen state + autosave indicator
   ────────────────────────────────────────────────────────── */
const ALL_SCREENS = ['welcome', 'identity', 'whatsapp', 'team', 'ai', 'preparing', 'ready'];

function StudioApp({ initialScreen, onScreenChange }) {
  const [screen, setScreen] = useState(initialScreen || 'welcome');
  const [data, setData] = useState({
    name: 'Clínica Bem Estar',
    slug: 'clinicabemestar',
    color: '#7B3FE4',
    logoLoaded: true,
    members: [
    { name: 'Renata Salgado', email: 'renata@bemestar.com.br', role: 'admin', isOwner: true },
    { name: 'Diego Santos', email: 'diego@bemestar.com.br', role: 'agent' },
    { name: 'Lia Andrade', email: 'lia@bemestar.com.br', role: 'agent' }],

    ai: {
      about: 'Clínica veterinária em Pinheiros, SP. Banho, tosa e veterinária. Atendimento de segunda a sábado, 8h às 18h.',
      tone: 'casual',
      canDo: ['Horário de atendimento', 'Endereço e localização', 'Formas de pagamento aceitas', 'Como funciona o agendamento'],
      escalate: ['Reclamações e problemas', 'Cliente irritado ou em crise'],
      greeting: 'Olá! Que bom ter você aqui. Sou o assistente da Clínica Bem Estar. Como posso te ajudar hoje?'
    },
    customer: { name: 'Renata', email: 'renata@bemestar.com.br' }
  });
  const [autosaved, setAutosaved] = useState(true);

  // Sync external screen changes (from Tweaks)
  useEffect(() => {if (initialScreen && initialScreen !== screen) setScreen(initialScreen); /* eslint-disable-next-line */}, [initialScreen]);
  useEffect(() => {onScreenChange?.(screen); /* eslint-disable-next-line */}, [screen]);

  // Fake autosave pulse on data change
  useEffect(() => {
    setAutosaved(false);
    const t = setTimeout(() => setAutosaved(true), 600);
    return () => clearTimeout(t);
  }, [data]);

  const stepIdx = STEPS.findIndex((s) => s.key === screen);
  const showProgress = stepIdx >= 0;

  return (
    <div className="st-app" data-screen={screen}>
      <StudioTop stepIdx={Math.max(0, stepIdx)} totalSteps={STEPS.length} autosaved={autosaved} hideProgress={!showProgress || screen === 'preparing' || screen === 'ready'} />

      {screen === 'welcome' &&
      <WelcomeScreen customerName={data.customer?.name} onStart={() => setScreen('identity')} />
      }
      {screen === 'identity' &&
      <IdentityStep data={data} setData={setData} onBack={() => setScreen('welcome')} onNext={() => setScreen('whatsapp')} />
      }
      {screen === 'whatsapp' &&
      <WhatsappStep data={data} setData={setData} onBack={() => setScreen('identity')} onNext={() => setScreen('team')} />
      }
      {screen === 'team' &&
      <TeamStep data={data} setData={setData} onBack={() => setScreen('whatsapp')} onNext={() => setScreen('ai')} customer={data.customer} />
      }
      {screen === 'ai' &&
      <AIStep data={data} setData={setData} onBack={() => setScreen('team')} onFinish={() => setScreen('preparing')} />
      }
      {screen === 'preparing' &&
      <PreparingScreen onForceReady={(action) => action === 'back' ? setScreen('ai') : setScreen('ready')} />
      }
      {screen === 'ready' &&
      <ReadyScreen data={data} onRestart={() => setScreen('welcome')} />
      }
    </div>);

}

window.StudioApp = StudioApp;
window.STUDIO_SCREENS = ALL_SCREENS;