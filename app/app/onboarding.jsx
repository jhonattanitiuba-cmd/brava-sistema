// 4-step onboarding wizard. Persists state across steps.

const ONB_STEPS = [
  { key: 'workspace', label: 'Workspace', icon: 'Building2', sub: 'Identidade visual e nome' },
  { key: 'channel', label: 'Canal', icon: 'Smartphone', sub: 'Conectar WhatsApp via Evolution' },
  { key: 'team', label: 'Equipe', icon: 'Users', sub: 'Convidar atendentes' },
  { key: 'ai', label: 'Agente IA', icon: 'Sparkles', sub: 'Treinar com contexto da empresa' },
];

const COLOR_PRESETS = [
  { name: 'Brava',     hex: '#7B3FE4', grad: 'linear-gradient(90deg,#7B3FE4,#1E90FF)' },
  { name: 'Verde',     hex: '#1D9E75' },
  { name: 'Laranja',   hex: '#BA7517' },
  { name: 'Vermelho',  hex: '#A32D2D' },
  { name: 'Azul',      hex: '#185FA5' },
  { name: 'Cinza',     hex: '#4A4A52' },
  { name: 'Rosa',      hex: '#E91E63' },
  { name: 'Preto',     hex: '#0A0A0F' },
  { name: 'Branco',    hex: '#FFFFFF' },
];

const OnboardingWizard = ({ onContinue, onDataChange }) => {
  const [step, setStep] = React.useState(0);
  // Detecta sessão anônima (veio do checkout sem login): pede e-mail/senha no fim
  const [isAnon, setIsAnon] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await window.supabase.auth.getUser();
        if (user?.is_anonymous) setIsAnon(true);
      } catch (e) {}
    })();
  }, []);
  const [data, setData] = React.useState({
    workspaceName: '',
    slug: '',
    primaryColor: '#7B3FE4',
    secondaryColor: '',
    darkMode: false,
    logoUploaded: false,
    logoUrl: null,
    logoFileName: null,
    channelMode: 'evolution',
    qrScanned: false,
    connectLater: false,
    invites: [
      { email: '', role: 'admin' },
      { email: '', role: 'agent' },
      { email: '', role: 'agent' },
    ],
    bizName: '',
    bizDoes: '',
    bizHours: '',
    bizFaq: '',
    bizTone: 'profissional-amigavel',
    bizModel: 'gpt-4o-mini',
    // Contexto adicional pro agente (cliente preenche)
    bizPublico: '',
    bizLocalizacao: '',
    bizTicketMedio: '',
    bizProdutos: '',
    bizDiferenciais: '',
    bizConcorrentes: '',
    bizPolitica: '',
    bizPagamento: '',
    bizPrazo: '',
    bizCanais: '',
    bizEscalonamento: '',
    bizBoasVindas: '',
    bizForaHorario: '',
    bizLimitacoes: '',
    bizPersona: '',
    bizGatilhos: '',
    bizFollowUp: '',
    bizPalavrasEvitar: '',
    email: '',
    password: '',
  });
  const update = patch => setData(d => {
    const next = { ...d, ...patch };
    if (onDataChange) onDataChange(next);
    return next;
  });

  const STEPS = isAnon
    ? [...ONB_STEPS, { key: 'acesso', label: 'Acesso', icon: 'Lock', sub: 'Crie sua senha de acesso' }]
    : ONB_STEPS;
  const lastStep = STEPS.length - 1;

  const next = () => step < lastStep ? setStep(step + 1) : onContinue('done');
  const prev = () => step > 0 ? setStep(step - 1) : onContinue('login');

  const valid = (() => {
    if (!data) return false;
    const key = STEPS[step]?.key;
    if (key === 'workspace') return (data.workspaceName || '').length >= 3 && (data.slug || '').length >= 3;
    if (key === 'channel') return !!data.qrScanned || !!data.connectLater;
    if (key === 'team') return true; // equipe é opcional — o dono já entra como owner
    if (key === 'ai') return (data.bizDoes || '').length > 30;
    if (key === 'acesso') return /.+@.+\..+/.test(data.email || '') && (data.password || '').length >= 6;
    return true;
  })();

  return (
    <div className="onb-page">
      {/* Top chrome */}
      <header className="onb-top">
        <div className="onb-top__brand">
          <img src="app/assets/brava-logo-white.png" alt="Brava Company" style={{height:17, objectFit:'contain'}}/>
        </div>
        <div className="onb-top__progress">
          <span>Configuração inicial</span>
          <div className="onb-top__bar"><div style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          <span className="onb-top__count">{step + 1} de {STEPS.length}</span>
        </div>
        <button className="onb-top__exit" onClick={() => onContinue('login')}>
          Sair <Icon name="X" size={16} />
        </button>
      </header>

      <div className="onb-shell">
        {/* Stepper */}
        <aside className="onb-rail">
          <div className="onb-rail__head">
            <Badge variant="brand" icon="Sparkles">Onboarding</Badge>
            <h2>Vamos preparar seu workspace</h2>
            <p>Quatro passos rápidos. Você pode ajustar tudo depois em Configurações.</p>
          </div>

          <ol className="onb-rail__steps">
            {STEPS.map((s, i) => {
              const state = i < step ? 'done' : i === step ? 'active' : 'pending';
              return (
                <li key={s.key} className={`onb-step onb-step--${state}`}>
                  <span className="onb-step__bullet">
                    {state === 'done' ? <Icon name="Check" size={14} /> : <Icon name={s.icon} size={14} />}
                  </span>
                  <span className="onb-step__body">
                    <span className="onb-step__label">{s.label}</span>
                    <span className="onb-step__sub">{s.sub}</span>
                  </span>
                  {state === 'active' && <span className="onb-step__pulse" />}
                </li>
              );
            })}
          </ol>

          <div className="onb-rail__foot">
            <Icon name="LifeBuoy" size={16} />
            <div>
              <strong>Precisa de ajuda?</strong>
              <span>Resposta em até 4h no plano Performance.</span>
            </div>
          </div>
        </aside>

        {/* Stage */}
        <main className="onb-stage">
          {step === 0 && <StepWorkspace data={data} update={update} />}
          {step === 1 && <StepChannel data={data} update={update} />}
          {step === 2 && <StepTeam data={data} update={update} />}
          {step === 3 && <StepAI data={data} update={update} />}
          {STEPS[step] && STEPS[step].key === 'acesso' && <StepAcesso data={data} update={update} />}

          <footer className="onb-footer">
            <div className="onb-footer__hint">
              {!valid && <><Icon name="Info" size={14} /> Preencha o necessário para continuar</>}
            </div>
            <div className="onb-footer__actions">
              <Button variant="ghost" icon="ArrowLeft" onClick={prev}>{step === 0 ? 'Sair' : 'Voltar'}</Button>
              {step === 1 && !data.qrScanned && (
                <Button variant="ghost" icon="Clock" onClick={() => { update({ connectLater: true }); next(); }}>
                  Conectar depois
                </Button>
              )}
              <Button variant="primary" iconRight={step === lastStep ? 'Check' : 'ArrowRight'} disabled={!valid} onClick={next}>
                {step === lastStep ? 'Concluir e abrir Dashboard' : 'Continuar'}
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

// ───────── Color Picker Customizado ─────────
const ColorPickerCustom = ({ value, onChange, ativo, corAtiva }) => {
  const inputRef = React.useRef(null);
  const [hex, setHex] = React.useState(value || '#7B3FE4');
  React.useEffect(() => { setHex(value || '#7B3FE4'); }, [value]);
  return (
    <button
      onClick={() => inputRef.current?.click()}
      className={`onb-color ${ativo ? 'onb-color--on' : ''}`}
      style={{position:'relative', minHeight:84, cursor:'pointer', ...(ativo ? {'--cor-ativa': corAtiva || value} : {})}}
    >
      <input
        ref={inputRef}
        type="color"
        value={hex}
        onChange={e => { setHex(e.target.value); onChange(e.target.value); }}
        style={{position:'absolute', opacity:0, width:1, height:1, pointerEvents:'none'}}
      />
      <span className="onb-color__sw" style={{
        background: `${value && !['#7B3FE4','#1D9E75','#BA7517','#A32D2D','#185FA5','#4A4A52','#E91E63','#0A0A0F'].includes(value) ? value : 'conic-gradient(from 0deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6B6B)'}`,
        position:'relative',
      }}>
        <Icon name="Pipette" size={16} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', color:'#fff', filter:'drop-shadow(0 1px 2px rgba(0,0,0,.5))'}}/>
      </span>
      <span className="onb-color__lbl">Personalizada</span>
      <span className="onb-color__hex" style={{fontFamily:'JetBrains Mono, monospace'}}>
        {value && !['#7B3FE4','#1D9E75','#BA7517','#A32D2D','#185FA5','#4A4A52','#E91E63','#0A0A0F'].includes(value) ? value.toUpperCase() : 'escolher'}
      </span>
      {ativo && <span className="onb-color__check"><Icon name="Check" size={12} /></span>}
    </button>
  );
};

// ───────── Step 1 - Workspace ─────────

// Helpers de cor - contraste automático
const hexToRgb = (h) => {
  const c = (h || '#000000').replace('#','');
  return [parseInt(c.substr(0,2),16), parseInt(c.substr(2,2),16), parseInt(c.substr(4,2),16)];
};
const luminance = (h) => {
  const [r,g,b] = hexToRgb(h);
  return (0.299*r + 0.587*g + 0.114*b) / 255;
};
const textOn = (bg) => luminance(bg) > 0.6 ? '#0A0A0F' : '#FFFFFF';
const tintAlpha = (h, a) => {
  const [r,g,b] = hexToRgb(h);
  return `rgba(${r},${g},${b},${a})`;
};

const StepWorkspace = ({ data, update }) => {
  const fileRef = React.useRef(null);
  const [previewDark, setPreviewDark] = React.useState(false);
  React.useEffect(() => { setPreviewDark(!!data.darkMode); }, [data.darkMode]);
  const dark = previewDark;
  const primary  = data.primaryColor;
  const secondary = data.secondaryColor || primary;
  // Sidebar usa a cor primária; texto auto-ajustado pra legibilidade
  const navBg     = primary;
  const navText   = textOn(primary);
  const navTextMuted = textOn(primary) === '#FFFFFF' ? 'rgba(255,255,255,.65)' : 'rgba(10,10,15,.6)';
  // Conteúdo principal - segue o tema escolhido (light/dark)
  const bg       = dark ? '#0E0E14' : '#F5F5F5';
  const bgSub    = dark ? '#15151E' : '#FFFFFF';
  const border   = dark ? '#2A2A3A' : '#E6E6E6';
  const txt1     = dark ? '#F5F5F7' : '#0A0A0F';
  const txt2     = dark ? '#A0A0AA' : '#6E6E78';
  // Barrinhas usam a cor secundária com transparência
  const barBg    = tintAlpha(secondary, dark ? 0.3 : 0.35);
  const barLine  = tintAlpha(secondary, dark ? 0.5 : 0.55);
  // Item ativo da nav: contrast com a sidebar
  const activeBg = navText === '#FFFFFF' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.14)';

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Arquivo muito grande. Máximo 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = e => update({
      logoUploaded: true,
      logoUrl: e.target.result,
      logoFileName: file.name,
      logoSize: (file.size / 1024).toFixed(1) + ' KB',
    });
    reader.readAsDataURL(file);
  };

  const removerLogo = (e) => {
    e.stopPropagation();
    update({ logoUploaded: false, logoUrl: null, logoFileName: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
  <div className="onb-card">
    <div className="onb-card__head">
      <span className="onb-card__step">Passo 01 · Workspace</span>
      <h1>Como sua marca aparece para os atendentes</h1>
      <p>Logo, cores e nome ficam visíveis em todo o sistema. Você pode trocar a qualquer momento em Configurações → Workspace.</p>
    </div>

    <div className="onb-card__body onb-grid-2">
      <div className="onb-block">
        <div className="onb-block__title">Identidade</div>
        <Input label="Nome do workspace" value={data.workspaceName} onChange={e => update({ workspaceName: e.target.value })} hint="Aparece no topo da sidebar e em e-mails transacionais." />
        <Input label="Subdomínio" value={data.slug} onChange={e => update({ slug: e.target.value.replace(/[^a-z0-9-]/g, '').toLowerCase() })} suffix=".brava.software" hint="Url do seu workspace. Mínimo de 3 caracteres, sem espaço." />
      </div>

      <div className="onb-block">
        <div className="onb-block__title">Logo</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          style={{display:'none'}}
          onChange={e => handleFile(e.target.files?.[0])}
        />
        <div
          className={`onb-upload ${data.logoUploaded ? 'onb-upload--filled' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = data.primaryColor; }}
          onDragLeave={e => { e.currentTarget.style.borderColor = ''; }}
          onDrop={e => {
            e.preventDefault();
            e.currentTarget.style.borderColor = '';
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          {data.logoUploaded ? (
            <>
              <div className="onb-upload__preview" style={{background: data.logoUrl ? '#FFFFFF' : data.primaryColor, overflow:'hidden'}}>
                {data.logoUrl
                  ? <img src={data.logoUrl} alt="Logo" style={{width:'100%', height:'100%', objectFit:'contain'}}/>
                  : <Icon name="Building2" size={32} />
                }
              </div>
              <div className="onb-upload__meta">
                <strong>{data.logoFileName || 'logo.svg'}</strong>
                <span>{data.logoSize || '12.4 KB'} · enviado</span>
              </div>
              <Button variant="ghost" size="sm" icon="Trash2" onClick={removerLogo}>Remover</Button>
            </>
          ) : (
            <>
              <div className="onb-upload__icon"><Icon name="Upload" size={28} /></div>
              <div className="onb-upload__meta">
                <strong>Arraste seu logo ou clique</strong>
                <span>SVG, PNG, JPG ou WEBP, até 2MB. Recomendado: 512×512px.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="onb-card__body">
      <div className="onb-block">
        <div className="onb-block__title">Cor primária</div>
        <p className="onb-block__sub">Usada em links, ícones ativos e indicadores. Validamos automaticamente o contraste WCAG AA.</p>
        <div className="onb-colors">
          {COLOR_PRESETS.map(c => (
            <button key={c.hex}
              className={`onb-color ${data.primaryColor === c.hex ? 'onb-color--on' : ''}`}
              onClick={() => update({ primaryColor: c.hex })}
              style={data.primaryColor === c.hex ? { '--cor-ativa': c.hex } : {}}
            >
              <span className="onb-color__sw" style={{ background: c.grad || c.hex, border: c.hex === '#FFFFFF' ? '1px solid #D8D8D8' : 'none' }} />
              <span className="onb-color__lbl">{c.name}</span>
              <span className="onb-color__hex">{c.hex}</span>
              {data.primaryColor === c.hex && <span className="onb-color__check"><Icon name="Check" size={12} /></span>}
            </button>
          ))}
          <ColorPickerCustom
            value={data.primaryColor}
            onChange={v => update({ primaryColor: v })}
            ativo={!COLOR_PRESETS.some(c => c.hex === data.primaryColor)}
            corAtiva={data.primaryColor}
          />
        </div>
      </div>
    </div>

    <div className="onb-card__body">
      <div className="onb-block">
        <div className="onb-block__title">Cor secundária <span style={{fontSize:12, fontWeight:400, color:'#8E8E94', marginLeft:6}}>(opcional)</span></div>
        <p className="onb-block__sub">Aplicada em botões secundários e badges. Se não escolher, usamos a cor primária com transparência.</p>
        <div className="onb-colors">
          <button
            className={`onb-color ${!data.secondaryColor ? 'onb-color--on' : ''}`}
            onClick={() => update({ secondaryColor: '' })}
            style={{minHeight:84, ...(!data.secondaryColor ? {'--cor-ativa':'#8E8E94'} : {})}}
          >
            <span className="onb-color__sw" style={{ background: 'repeating-linear-gradient(45deg, #E6E6E6, #E6E6E6 6px, #F5F5F5 6px, #F5F5F5 12px)' }} />
            <span className="onb-color__lbl">Nenhuma</span>
            <span className="onb-color__hex">automático</span>
            {!data.secondaryColor && <span className="onb-color__check"><Icon name="Check" size={12} /></span>}
          </button>
          {COLOR_PRESETS.filter(c => c.hex !== data.primaryColor).map(c => (
            <button key={c.hex}
              className={`onb-color ${data.secondaryColor === c.hex ? 'onb-color--on' : ''}`}
              onClick={() => update({ secondaryColor: c.hex })}
              style={data.secondaryColor === c.hex ? { '--cor-ativa': c.hex } : {}}
            >
              <span className="onb-color__sw" style={{ background: c.grad || c.hex, border: c.hex === '#FFFFFF' ? '1px solid #D8D8D8' : 'none' }} />
              <span className="onb-color__lbl">{c.name}</span>
              <span className="onb-color__hex">{c.hex}</span>
              {data.secondaryColor === c.hex && <span className="onb-color__check"><Icon name="Check" size={12} /></span>}
            </button>
          ))}
          <ColorPickerCustom
            value={data.secondaryColor}
            onChange={v => update({ secondaryColor: v })}
            ativo={data.secondaryColor && !COLOR_PRESETS.some(c => c.hex === data.secondaryColor)}
            corAtiva={data.secondaryColor}
          />
        </div>
      </div>
    </div>

    <div className="onb-card__body">
      <div className="onb-block">
        <label
          onClick={() => update({ darkMode: !data.darkMode })}
          style={{
            display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
            background: data.darkMode ? 'rgba(30,144,255,.08)' : '#FFFFFF',
            border:`1px solid ${data.darkMode ? 'rgba(30,144,255,.4)' : '#D8D8D8'}`,
            borderRadius:12, cursor:'pointer',
            transition:'all .15s',
          }}
        >
          <div style={{
            width:42, height:24, borderRadius:999, position:'relative',
            background: data.darkMode ? '#1E90FF' : '#D8D8D8',
            transition:'background .2s',
            flexShrink:0,
          }}>
            <div style={{
              position:'absolute', top:2, left: data.darkMode ? 20 : 2,
              width:20, height:20, borderRadius:'50%', background:'#fff',
              transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)',
            }}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600, fontSize:14, color:'#0A0A0F'}}>Deseja usar modo escuro?</div>
            <div style={{fontSize:12.5, color:'#4A4A52', marginTop:2}}>Ativa o tema dark para incluirmos no seu workspace.</div>
          </div>
          <Icon name={data.darkMode ? 'Moon' : 'Sun'} size={20} style={{color: data.darkMode ? '#1E90FF' : '#8E8E94'}}/>
        </label>
      </div>
    </div>

    <div className="onb-preview">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
        <span className="onb-preview__tag">Preview do workspace</span>
        {data.darkMode && (
          <div style={{display:'inline-flex', background:'#FFFFFF', border:'1px solid #D8D8D8', borderRadius:999, padding:3, gap:2}}>
            <button onClick={()=>setPreviewDark(false)} style={{
              padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
              background: !previewDark ? '#1E90FF' : 'transparent',
              color: !previewDark ? '#fff' : '#4A4A52',
              display:'flex', alignItems:'center', gap:5, border:'none',
              transition:'all .15s',
            }}>
              <Icon name="Sun" size={12}/>Claro
            </button>
            <button onClick={()=>setPreviewDark(true)} style={{
              padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, cursor:'pointer',
              background: previewDark ? '#1E90FF' : 'transparent',
              color: previewDark ? '#fff' : '#4A4A52',
              display:'flex', alignItems:'center', gap:5, border:'none',
              transition:'all .15s',
            }}>
              <Icon name="Moon" size={12}/>Escuro
            </button>
          </div>
        )}
      </div>
      {/* Barra do navegador */}
      <div style={{
        display:'flex', alignItems:'center', gap:10,
        padding:'8px 12px',
        background: dark ? '#1B1B27' : '#E6E6E6',
        border:`1px solid ${border}`,
        borderBottom:'none',
        borderRadius:'12px 12px 0 0',
      }}>
        <div style={{display:'flex', gap:5}}>
          <span style={{width:10, height:10, borderRadius:'50%', background:'#FF5F57'}}/>
          <span style={{width:10, height:10, borderRadius:'50%', background:'#FEBC2E'}}/>
          <span style={{width:10, height:10, borderRadius:'50%', background:'#28C840'}}/>
        </div>
        <div style={{
          flex:1, display:'flex', alignItems:'center', gap:8,
          padding:'5px 12px',
          background: dark ? '#0E0E14' : '#FFFFFF',
          border:`1px solid ${border}`,
          borderRadius:6,
          fontFamily:'JetBrains Mono, monospace', fontSize:11,
          color: dark ? '#A0A0AA' : '#4A4A52',
        }}>
          <Icon name="Lock" size={11} style={{color: dark ? '#1D9E75' : '#1D9E75'}}/>
          <span>https://{data.slug || 'workspace'}.brava.software</span>
        </div>
      </div>

      <div className="onb-preview__chrome" style={{
        '--accent': primary,
        '--accent-2': secondary,
        background: bg,
        borderColor: border,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}>
        <div className="onb-preview__sb" style={{background: navBg, borderRightColor: tintAlpha(navText === '#FFFFFF' ? '#FFFFFF' : '#000000', .1)}}>
          <div className="onb-preview__ws" style={{padding:'10px 8px 14px'}}>
            <span className="onb-preview__avatar" style={{
              background: data.logoUrl ? '#FFFFFF' : (textOn(primary) === '#FFFFFF' ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'),
              color: navText,
              overflow: 'hidden',
              padding: data.logoUrl ? 2 : 0,
            }}>
              {data.logoUrl
                ? <img src={data.logoUrl} alt="Logo" style={{width:'100%', height:'100%', objectFit:'contain', borderRadius:5}}/>
                : data.workspaceName.slice(0, 1)
              }
            </span>
            <div style={{minWidth:0, flex:1}}>
              <strong style={{color: navText, display:'block', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{data.workspaceName || 'Seu workspace'}</strong>
              <span style={{color: navTextMuted, fontSize:11, display:'flex', alignItems:'center', gap:5, fontFamily:'Inter, sans-serif', fontWeight:400}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:'#1D9E75', flexShrink:0}}/>
                Online
              </span>
            </div>
          </div>
          {['LayoutDashboard', 'MessageCircle', 'KanbanSquare', 'BarChart3', 'Settings'].map((n, i) => (
            <div key={n} className={`onb-preview__nav ${i === 1 ? 'onb-preview__nav--on' : ''}`}
              style={i === 1 ? {
                background: activeBg,
                color: navText,
                fontWeight: 600,
                borderLeft: data.secondaryColor ? `3px solid ${secondary}` : `3px solid ${navText}`,
                paddingLeft: 7,
              } : { color: navTextMuted }}
            >
              <Icon name={n} size={14} />
              <span>{['Dashboard', 'Conversas', 'Pipeline', 'Analytics', 'Configurações'][i]}</span>
              {i === 1 && <span className="onb-preview__count" style={{
                background: secondary,
                color: textOn(secondary),
              }}>12</span>}
            </div>
          ))}
        </div>
        <div className="onb-preview__main" style={{background: bg}}>
          <div style={{display:'flex', gap:8, marginBottom:12}}>
            <span style={{height:24, padding:'0 14px', borderRadius:6, background:primary, color:textOn(primary), fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center'}}>Botão primário</span>
            <span style={{height:24, padding:'0 14px', borderRadius:6, background:secondary, color:textOn(secondary), fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center'}}>Botão secundário</span>
          </div>
          <div className="onb-preview__bar">
            <span style={{background: barBg, borderColor: 'transparent'}}/>
            <span style={{background: barBg, borderColor: 'transparent'}}/>
          </div>
          <div className="onb-preview__rows">
            {[0, 1, 2].map(i => (
              <div key={i} className="onb-preview__row" style={{background: bgSub, borderColor: border}}>
                <span style={{background: barLine}}/>
                <span style={{background: barLine}}/>
                <span style={{background: barLine}}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// ───────── Step 2 - Channel ─────────

// Sanitiza um slug pra virar instance_name valido na Evolution
// (alfanumerico, _, -, sem espacos, 3-32 chars).
// Em vez de regex Unicode (que Babel standalone falha as vezes),
// usa loop manual que filtra char a char.
function _instanceNameFromSlug(slug) {
  const normalized = String(slug || '').normalize('NFD');
  let out = '';
  for (let i = 0; i < normalized.length && out.length < 32; i++) {
    const code = normalized.charCodeAt(i);
    // Combining diacritical marks: U+0300 (768) a U+036F (879) - pula
    if (code >= 0x0300 && code <= 0x036f) continue;
    const ch = normalized[i];
    // Mantém A-Z, a-z, 0-9, _, -
    if (/^[A-Za-z0-9_-]$/.test(ch)) out += ch;
  }
  return out || 'Workspace';
}

const StepChannel = ({ data, update }) => {
  // estado: idle | creating | qr | connecting | open | error
  const [state, setState] = React.useState(data.qrScanned ? 'open' : 'idle');
  const [qrBase64, setQrBase64] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [attempt, setAttempt] = React.useState(0);
  const [profile, setProfile] = React.useState(null); // {ownerJid, profileName, profilePicUrl}

  // Nome tecnico da instancia derivado do slug do workspace
  const instanceName = React.useMemo(
    () => _instanceNameFromSlug(data.slug) + '_' + Date.now().toString(36).slice(-4),
    [] // memoria fixa ao montar - se trocar slug e voltar pra esse step, mantem
  );

  // Persiste o instanceName no wizard data (usado pelo save-onboarding pra linkar)
  React.useEffect(() => {
    if (!data.evolutionInstanceName) update({ evolutionInstanceName: instanceName });
  }, []);

  // 1) Buscar QR ao entrar no modo evolution (so se ainda nao conectou)
  React.useEffect(() => {
    if (data.channelMode !== 'evolution') return;
    if (state === 'open') return;
    let alive = true;
    setQrBase64(null); setErrorMsg(''); setState('creating');

    (async () => {
      try {
        // Tenta connect primeiro (se ja existe na Evolution)
        let resp;
        try {
          resp = await window.evoAdmin.connect(instanceName);
        } catch (e) {
          if (e.status === 404 || /not found|does not exist/i.test(e.message || '')) {
            // Cria com template Brava (webhook + settings)
            resp = await window.evoAdmin.create(instanceName);
          } else throw e;
        }
        if (!alive) return;
        // Extrai QR (Evolution v1/v2 retornam em campos diferentes)
        const qr =
          resp?.base64 || resp?.qrcode?.base64 || resp?.qrcode?.code
          || resp?.qr || resp?.code
          || (typeof resp === 'string' ? resp : null);
        if (qr) {
          setQrBase64(qr.startsWith('data:') ? qr : ('data:image/png;base64,' + qr.replace(/^data:image\/png;base64,/, '')));
          setState('qr');
        } else {
          // Pode ja estar conectada
          const st = await window.evoAdmin.state(instanceName).catch(() => null);
          const real = st?.instance?.state || st?.state;
          if (real === 'open') { setState('open'); update({ qrScanned: true }); return; }
          throw new Error('Evolution nao retornou QR. Tente novamente.');
        }
      } catch (e) {
        if (alive) { setState('error'); setErrorMsg(e.message || 'Erro ao gerar QR code'); }
      }
    })();
    return () => { alive = false; };
  }, [data.channelMode, attempt]);

  // 2) Polling do state a cada 2s (so quando qr ou connecting)
  React.useEffect(() => {
    if (state !== 'qr' && state !== 'connecting') return;
    let alive = true;
    const tick = async () => {
      try {
        const st = await window.evoAdmin.state(instanceName);
        const real = st?.instance?.state || st?.state;
        if (!alive) return;
        if (real === 'open') {
          setState('open');
          // Sincroniza profile (foto, nome, telefone) via fetchInfo
          try {
            const info = await window.evoAdmin.fetchInfo(instanceName);
            const inst = Array.isArray(info) ? info[0] : info;
            if (inst) setProfile({
              ownerJid: inst.ownerJid,
              profileName: inst.profileName,
              profilePicUrl: inst.profilePicUrl,
            });
          } catch {}
          // Marca no wizard data pra avancar
          update({ qrScanned: true });
        } else if (real === 'connecting') {
          setState('connecting');
        }
      } catch {}
    };
    const t = setInterval(tick, 2000); tick();
    return () => { alive = false; clearInterval(t); };
  }, [state, instanceName]);

  const formatPhone = (jid) => {
    if (!jid) return '';
    const num = String(jid).replace(/@.*$/, '').replace(/\D/g, '');
    const m = num.match(/^(55)(\d{2})(\d{5})(\d{4})$/);
    return m ? `+${m[1]} ${m[2]} ${m[3]}-${m[4]}` : '+' + num;
  };

  return (
    <div className="onb-card">
      <div className="onb-card__head">
        <span className="onb-card__step">Passo 02 · Canal</span>
        <h1>Conecte o WhatsApp do seu negócio</h1>
        <p>Use a Evolution API para conectar um número novo via QR Code, ou WhatsApp Cloud API se você já tem credenciais Meta.</p>
      </div>

      <div className="onb-card__body onb-grid-2">
        <button className={`onb-mode ${data.channelMode === 'evolution' ? 'onb-mode--on' : ''}`} onClick={() => update({ channelMode: 'evolution', qrScanned: false })}>
          <div className="onb-mode__head">
            <span className="onb-mode__ico"><Icon name="QrCode" size={20} /></span>
            <Badge variant="success">Recomendado</Badge>
          </div>
          <strong>Evolution API · QR Code</strong>
          <p>Pegue qualquer celular com WhatsApp e escaneie. Funciona em 30 segundos. Já incluído no plano.</p>
        </button>

        <button className={`onb-mode ${data.channelMode === 'cloud' ? 'onb-mode--on' : ''}`} onClick={() => update({ channelMode: 'cloud', qrScanned: false })}>
          <div className="onb-mode__head">
            <span className="onb-mode__ico"><Icon name="Globe" size={20} /></span>
            <Badge variant="neutral">Performance+</Badge>
          </div>
          <strong>WhatsApp Cloud API</strong>
          <p>Para volumes altos. Requer aprovação Meta e número Business verificado.</p>
        </button>
      </div>

      <div className="onb-card__body">
        {data.channelMode === 'evolution' ? (
          <div className="onb-qr">
            <div className={`onb-qr__panel ${state === 'open' ? 'onb-qr__panel--scanned' : ''}`}>
              {state === 'creating' && (
                <div className="onb-qr__code" style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:40}}>
                  <div style={{width:48, height:48, border:'3px solid rgba(123,63,228,.2)', borderTopColor:'#7B3FE4', borderRadius:'50%', animation:'onbSpin 1s linear infinite'}}/>
                  <div style={{fontSize:13, color:'#6E6E78'}}>Gerando QR code…</div>
                </div>
              )}
              {(state === 'qr' || state === 'connecting') && qrBase64 && (
                <div className="onb-qr__code">
                  <img src={qrBase64} alt="QR Code WhatsApp" style={{width:220, height:220, display:'block', borderRadius:8}}/>
                  {state === 'connecting' && (
                    <div style={{marginTop:10, fontSize:12, color:'#F5A623', display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
                      <span style={{width:8,height:8,borderRadius:'50%',background:'#F5A623',animation:'onbPulse 1.2s ease-in-out infinite'}}/> Conectando…
                    </div>
                  )}
                </div>
              )}
              {state === 'open' && (
                <div className="onb-qr__success">
                  {profile?.profilePicUrl ? (
                    <img src={profile.profilePicUrl} alt="" style={{width:72, height:72, borderRadius:'50%', marginBottom:8, objectFit:'cover'}}/>
                  ) : (
                    <span className="onb-qr__check"><Icon name="Check" size={36} /></span>
                  )}
                  <strong>Conectado</strong>
                  <span>{profile?.profileName || data.bizName} {profile?.ownerJid && '· ' + formatPhone(profile.ownerJid)}</span>
                </div>
              )}
              {state === 'error' && (
                <div style={{padding:40, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:12}}>
                  <Icon name="AlertCircle" size={36} style={{color:'#A32D2D'}}/>
                  <div style={{fontSize:13, fontWeight:600}}>Erro ao gerar QR</div>
                  <div style={{fontSize:11, color:'#6E6E78', maxWidth:240, lineHeight:1.5}}>{errorMsg}</div>
                  <Button variant="primary" size="sm" onClick={() => setAttempt(a => a+1)}>Tentar de novo</Button>
                </div>
              )}
            </div>
            <div className="onb-qr__how">
              <div className="onb-block__title">Como conectar</div>
              <ol className="onb-qr__steps">
                <li><span>1</span><div><strong>Abra o WhatsApp</strong> no celular do seu negócio</div></li>
                <li><span>2</span><div>Toque em <strong>⋮ Menu</strong> → <strong>Aparelhos conectados</strong></div></li>
                <li><span>3</span><div>Toque em <strong>Conectar um aparelho</strong> e aponte a câmera</div></li>
                <li><span>4</span><div>O Brava sincroniza histórico recente automaticamente</div></li>
              </ol>
              {state === 'qr' && (
                <div className="onb-qr__sim">
                  <Button variant="outline" size="sm" icon="RotateCcw" onClick={() => setAttempt(a => a+1)}>
                    Gerar novo QR
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="onb-grid-2">
            <Input label="Phone Number ID (Meta)" placeholder="123456789012345" />
            <Input label="WhatsApp Business Account ID" placeholder="987654321098765" />
            <Input label="Permanent Access Token" type="password" placeholder="EAAG…" />
            <Input label="Verify Token (webhook)" placeholder="brava_secure_token" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Button variant="primary" icon="Check" onClick={() => update({ qrScanned: true })}>Validar credenciais</Button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes onbSpin { from {transform:rotate(0)} to {transform:rotate(360deg)} }
        @keyframes onbPulse { 0%,100% {opacity:1} 50% {opacity:.3} }
      `}</style>
    </div>
  );
};

// ───────── Step 3 - Team ─────────

const StepTeam = ({ data, update }) => {
  const setInvite = (i, patch) => {
    const next = data.invites.map((v, idx) => idx === i ? { ...v, ...patch } : v);
    update({ invites: next });
  };
  const addRow = () => update({ invites: [...data.invites, { email: '', role: 'agent' }] });
  const removeRow = i => update({ invites: data.invites.filter((_, idx) => idx !== i) });

  const valid = data.invites.filter(v => v.email.includes('@')).length;

  return (
    <div className="onb-card">
      <div className="onb-card__head">
        <span className="onb-card__step">Passo 03 · Equipe</span>
        <h1>Convide quem vai atender</h1>
        <p>Cada atendente recebe um e-mail com link de acesso. Você pode ajustar permissões depois em Configurações → Atendentes.</p>
      </div>

      <div className="onb-card__body">
        <div className="onb-roles">
          {[
            ['Admin', 'Configura tudo. Acessa billing e relatórios completos.', 'Settings'],
            ['Supervisor', 'Visualiza todos os atendimentos, gerencia filas e SLA.', 'BarChart3'],
            ['Atendente', 'Conversas atribuídas e da fila. Sem billing.', 'MessageCircle'],
          ].map(([t, d, ic]) => (
            <div key={t} className="onb-role">
              <span className="onb-role__ic"><Icon name={ic} size={16} /></span>
              <strong>{t}</strong>
              <p>{d}</p>
            </div>
          ))}
        </div>

        <div className="onb-team">
          <div className="onb-team__head">
            <span>E-mail</span>
            <span>Função</span>
            <span></span>
          </div>
          {data.invites.map((row, i) => (
            <div key={i} className="onb-team__row">
              <Input
                placeholder={i === 0 ? 'admin@empresa.com.br' : 'atendente@empresa.com.br'}
                icon="Mail"
                type="email"
                value={row.email}
                onChange={e => setInvite(i, { email: e.target.value })}
              />
              <select className="onb-select" value={row.role} onChange={e => setInvite(i, { role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="supervisor">Supervisor</option>
                <option value="agent">Atendente</option>
              </select>
              <button className="onb-team__rm" onClick={() => removeRow(i)} aria-label="Remover">
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
          <button className="onb-team__add" onClick={addRow}>
            <Icon name="Plus" size={16} /> Adicionar atendente
          </button>
        </div>

        <div className="onb-team__limit">
          <div>
            <Icon name="Users" size={16} />
            <span><b>{valid}</b> de <b>10</b> atendentes do seu plano</span>
          </div>
          <div className="onb-team__bar">
            <div style={{ width: `${(valid / 10) * 100}%` }} />
          </div>
          <a className="auth-link" href="#">Plano Performance · ver detalhes</a>
        </div>
      </div>
    </div>
  );
};

// ───────── Step 4 - AI Agent ─────────

const StepAI = ({ data, update }) => {
  const tones = [
    ['profissional-amigavel', 'Profissional & próximo', 'Equilibrado, sem rigidez.'],
    ['formal', 'Formal', 'Para B2B com tom institucional.'],
    ['informal', 'Informal & direto', 'Conversa de WhatsApp natural.'],
  ];
  const models = [
    ['gpt-4o-mini', 'gpt-4o-mini', 'Padrão. Rápido e econômico.', 'Incluído'],
    ['gpt-4o', 'gpt-4o', 'Mais capaz. Para casos complexos.', '+R$ 0,12/conv'],
    ['claude-haiku', 'claude-haiku-4-5', 'Alternativa Anthropic.', 'Beta'],
  ];

  // Calcula completeness com base em todos os campos preenchidos
  const camposIA = ['bizDoes','bizHours','bizFaq','bizPublico','bizLocalizacao','bizTicketMedio','bizProdutos','bizDiferenciais','bizPolitica','bizPagamento','bizPrazo','bizCanais','bizEscalonamento','bizBoasVindas','bizLimitacoes','bizPersona','bizGatilhos'];
  const preenchidos = camposIA.filter(k => (data[k] || '').toString().trim().length > 5).length;
  const completeness = Math.round((preenchidos / camposIA.length) * 100);

  return (
    <div className="onb-card">
      <div className="onb-card__head">
        <span className="onb-card__step">Passo 04 · Agente IA</span>
        <h1>Treine o agente com o contexto do negócio</h1>
        <p>Quanto mais específico, melhor a resposta. Tudo isso vira o prompt do agente - você pode revisar depois em Configurações → Agente IA.</p>
      </div>

      <div className="onb-card__body onb-ai">
        <div className="onb-ai__form">
          <Input label="Nome da empresa" value={data.bizName} onChange={e => update({ bizName: e.target.value })} />

          <div className="bv-field">
            <label className="bv-label">O que a empresa faz?</label>
            <textarea className="onb-textarea" rows={4} value={data.bizDoes} onChange={e => update({ bizDoes: e.target.value })} />
            <div className="bv-hint">Inclua serviços/produtos, diferenciais, faixa de preço se relevante.</div>
          </div>

          <div className="onb-grid-2">
            <div className="bv-field">
              <label className="bv-label">Horário de atendimento</label>
              <textarea className="onb-textarea" rows={3} value={data.bizHours} onChange={e => update({ bizHours: e.target.value })} />
            </div>
            <div className="bv-field">
              <label className="bv-label">FAQ resumido</label>
              <textarea className="onb-textarea" rows={3} value={data.bizFaq} onChange={e => update({ bizFaq: e.target.value })} />
            </div>
          </div>

          {/* ───── Mercado e público ───── */}
          <div style={{paddingTop:18, borderTop:'1px solid #E6E6E6', marginTop:6}}>
            <div className="onb-block__title" style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <span style={{padding:'4px 10px', background:'#1E90FF', color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'.05em'}}>SEÇÃO 02</span>
              Mercado e público
            </div>

            <div className="onb-grid-2">
              <div className="bv-field">
                <label className="bv-label">Tipo de cliente</label>
                <select className="onb-select" value={data.bizPublico} onChange={e => update({ bizPublico: e.target.value })}>
                  <option value="b2c">B2C - vende para pessoa física</option>
                  <option value="b2b">B2B - vende para empresas</option>
                  <option value="ambos">Ambos B2B e B2C</option>
                </select>
              </div>
              <div className="bv-field">
                <label className="bv-label">Ticket médio</label>
                <input className="bv-input" placeholder="Ex: R$ 200" value={data.bizTicketMedio} onChange={e => update({ bizTicketMedio: e.target.value })} />
              </div>
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Localização / cidades atendidas</label>
              <input className="bv-input" placeholder="Endereço físico, cidades ou regiões" value={data.bizLocalizacao} onChange={e => update({ bizLocalizacao: e.target.value })} />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Concorrentes diretos <span style={{color:'#8E8E94', fontWeight:400, fontSize:11}}>(opcional)</span></label>
              <input className="bv-input" placeholder="Nome dos principais concorrentes" value={data.bizConcorrentes} onChange={e => update({ bizConcorrentes: e.target.value })} />
              <div className="bv-hint">A IA evita falar mal deles e usa pra reforçar diferenciais quando o cliente comparar.</div>
            </div>
          </div>

          {/* ───── Produtos e diferenciais ───── */}
          <div style={{paddingTop:18, borderTop:'1px solid #E6E6E6', marginTop:18}}>
            <div className="onb-block__title" style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <span style={{padding:'4px 10px', background:'#1E90FF', color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'.05em'}}>SEÇÃO 03</span>
              Produtos, preços e diferenciais
            </div>

            <div className="bv-field">
              <label className="bv-label">Produtos / serviços principais (com preços)</label>
              <textarea className="onb-textarea" rows={3} value={data.bizProdutos} onChange={e => update({ bizProdutos: e.target.value })} placeholder="Ex: Plano Básico R$ 99/mês - inclui X, Y, Z. Plano Pro R$ 299/mês..." />
              <div className="bv-hint">A IA usa isso pra cotar valores na hora.</div>
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Principais diferenciais</label>
              <textarea className="onb-textarea" rows={3} value={data.bizDiferenciais} onChange={e => update({ bizDiferenciais: e.target.value })} placeholder="O que sua empresa tem que os concorrentes não têm" />
            </div>

            <div className="onb-grid-2" style={{marginTop:14}}>
              <div className="bv-field">
                <label className="bv-label">Formas de pagamento aceitas</label>
                <input className="bv-input" placeholder="Pix, cartão, boleto..." value={data.bizPagamento} onChange={e => update({ bizPagamento: e.target.value })} />
              </div>
              <div className="bv-field">
                <label className="bv-label">Tempo de atendimento / entrega</label>
                <input className="bv-input" placeholder="Ex: 24h, 3-5 dias úteis" value={data.bizPrazo} onChange={e => update({ bizPrazo: e.target.value })} />
              </div>
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Política de cancelamento / reembolso</label>
              <textarea className="onb-textarea" rows={2} value={data.bizPolitica} onChange={e => update({ bizPolitica: e.target.value })} placeholder="Em quanto tempo pode cancelar, multa, reembolso..." />
            </div>
          </div>

          {/* ───── Operação e canais ───── */}
          <div style={{paddingTop:18, borderTop:'1px solid #E6E6E6', marginTop:18}}>
            <div className="onb-block__title" style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <span style={{padding:'4px 10px', background:'#1E90FF', color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'.05em'}}>SEÇÃO 04</span>
              Operação e canais
            </div>

            <div className="bv-field">
              <label className="bv-label">Outros canais (site, Instagram, e-mail)</label>
              <input className="bv-input" placeholder="Site, redes sociais, telefone..." value={data.bizCanais} onChange={e => update({ bizCanais: e.target.value })} />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Mensagem de boas-vindas (1ª resposta da IA)</label>
              <textarea className="onb-textarea" rows={2} value={data.bizBoasVindas} onChange={e => update({ bizBoasVindas: e.target.value })} placeholder="Como a IA cumprimenta um cliente novo" />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Mensagem fora do horário <span style={{color:'#8E8E94', fontWeight:400, fontSize:11}}>(opcional)</span></label>
              <textarea className="onb-textarea" rows={2} value={data.bizForaHorario} onChange={e => update({ bizForaHorario: e.target.value })} placeholder="Resposta automática quando estiver fechado" />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Quando passar pra um humano (escalonamento)</label>
              <textarea className="onb-textarea" rows={2} value={data.bizEscalonamento} onChange={e => update({ bizEscalonamento: e.target.value })} placeholder="Situações que devem ser tratadas por um atendente humano" />
            </div>
          </div>

          {/* ───── Personalidade do agente ───── */}
          <div style={{paddingTop:18, borderTop:'1px solid #E6E6E6', marginTop:18}}>
            <div className="onb-block__title" style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <span style={{padding:'4px 10px', background:'#1E90FF', color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'.05em'}}>SEÇÃO 05</span>
              Personalidade e comportamento
            </div>

            <div className="bv-field">
              <label className="bv-label">Persona do agente (como ele se comporta)</label>
              <textarea className="onb-textarea" rows={2} value={data.bizPersona} onChange={e => update({ bizPersona: e.target.value })} placeholder="Ex: Vendedor experiente, consultor técnico, atendente caloroso..." />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Gatilhos e ações esperadas</label>
              <textarea className="onb-textarea" rows={2} value={data.bizGatilhos} onChange={e => update({ bizGatilhos: e.target.value })} placeholder="Ações que a IA deve executar em situações específicas" />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Estratégia de follow-up <span style={{color:'#8E8E94', fontWeight:400, fontSize:11}}>(opcional)</span></label>
              <textarea className="onb-textarea" rows={2} value={data.bizFollowUp} onChange={e => update({ bizFollowUp: e.target.value })} placeholder="Quando e como retomar contato com o lead" />
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Limitações (o que a IA NÃO pode fazer/prometer)</label>
              <textarea className="onb-textarea" rows={2} value={data.bizLimitacoes} onChange={e => update({ bizLimitacoes: e.target.value })} placeholder="Coisas que devem ser evitadas pela IA" />
              <div className="bv-hint" style={{color:'#A32D2D'}}>Crítico - protege a empresa de promessas indevidas.</div>
            </div>

            <div className="bv-field" style={{marginTop:14}}>
              <label className="bv-label">Palavras / expressões a evitar <span style={{color:'#8E8E94', fontWeight:400, fontSize:11}}>(opcional)</span></label>
              <input className="bv-input" placeholder="Ex: garantia, exclusivo, melhor do mercado..." value={data.bizPalavrasEvitar} onChange={e => update({ bizPalavrasEvitar: e.target.value })} />
            </div>
          </div>

          {/* ───── Tom e modelo ───── */}
          <div style={{paddingTop:18, borderTop:'1px solid #E6E6E6', marginTop:18}}>
            <div className="onb-block__title" style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
              <span style={{padding:'4px 10px', background:'#1E90FF', color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'.05em'}}>SEÇÃO 06</span>
              Tom e modelo de IA
            </div>

          <div className="bv-field">
            <label className="bv-label">Tom da marca</label>
            <div className="onb-tone">
              {tones.map(([k, t, d]) => (
                <label key={k} className={`onb-tone__opt ${data.bizTone === k ? 'onb-tone__opt--on' : ''}`}>
                  <input type="radio" name="tone" checked={data.bizTone === k} onChange={() => update({ bizTone: k })} />
                  <strong>{t}</strong>
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bv-field" style={{marginTop:14}}>
            <label className="bv-label">Modelo de IA</label>
            <div className="onb-models">
              {models.map(([k, n, d, c]) => (
                <label key={k} className={`onb-model ${data.bizModel === k ? 'onb-model--on' : ''}`}>
                  <input type="radio" name="model" checked={data.bizModel === k} onChange={() => update({ bizModel: k })} />
                  <div>
                    <strong>{n}</strong>
                    <span>{d}</span>
                  </div>
                  <Badge variant={c === 'Incluído' ? 'success' : c === 'Beta' ? 'info' : 'neutral'}>{c}</Badge>
                </label>
              ))}
            </div>
          </div>
          </div>
        </div>

        <aside className="onb-ai__side">
          <div className="onb-ai__card">
            <div className="onb-ai__card-head">
              <Icon name="Sparkles" size={16} />
              <span>Pré-visualização do agente</span>
            </div>

            <div className="onb-ai__chat">
              <div className="onb-ai__msg onb-ai__msg--in">
                <span className="onb-ai__avatar">CL</span>
                <div className="onb-ai__bubble">Boa tarde! Tem vaga aí pra deixar 4 dias a partir de quinta?</div>
              </div>
              <div className="onb-ai__msg onb-ai__msg--out">
                <div className="onb-ai__bubble onb-ai__bubble--brand">
                  Olá! Temos sim, pode reservar tranquilo. Para 4 diárias a partir de quinta-feira fica
                  <b> R$ 196 </b> com transfer ida e volta incluído. Quer que eu já reserve no seu nome?
                </div>
                <span className="onb-ai__avatar onb-ai__avatar--brand"><Icon name="Sparkles" size={14} /></span>
              </div>
              <div className="onb-ai__msg onb-ai__msg--in">
                <span className="onb-ai__avatar">CL</span>
                <div className="onb-ai__bubble">Tem cobertura? E lavagem fica quanto?</div>
              </div>
              <div className="onb-ai__msg onb-ai__msg--out">
                <div className="onb-ai__bubble onb-ai__bubble--brand">
                  Sim, 100% das vagas são cobertas. Lavagem completa é opcional, fica
                  <b> R$ 35 </b>e o carro é entregue limpo no seu retorno.
                </div>
                <span className="onb-ai__avatar onb-ai__avatar--brand"><Icon name="Sparkles" size={14} /></span>
              </div>
            </div>

            <div className="onb-ai__meter">
              <div className="onb-ai__meter-head">
                <span>Contexto fornecido</span>
                <span><b>{completeness}%</b></span>
              </div>
              <div className="onb-ai__meter-bar"><div style={{ width: `${completeness}%` }} /></div>
              <div className="onb-ai__meter-hint">
                {completeness >= 75 ? 'Excelente - agente vai responder com confiança.' : completeness >= 40 ? 'Bom - adicione mais detalhes para reduzir respostas vagas.' : 'Mínimo. Adicione FAQ e horário antes de ativar.'}
              </div>
            </div>
          </div>

          <div className="onb-ai__hint">
            <Icon name="Info" size={14} />
            <p>O agente é desligado por padrão. Você ativa em <b>Configurações → Agente IA</b> quando quiser. O comando <code>/parar</code> em qualquer conversa desliga o agente naquele atendimento.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Último passo (só pra quem entrou anônimo): cria e-mail+senha pra acessar de qualquer lugar
const StepAcesso = ({ data, update }) => (
  <div className="onb-card">
    <div className="onb-card__head">
      <span className="onb-card__step">Último passo · Acesso</span>
      <h1>Crie seu acesso</h1>
      <p>Defina e-mail e senha pra entrar no seu sistema de qualquer aparelho, quando quiser.</p>
    </div>
    <div className="onb-card__body">
      <div className="onb-block">
        <Input label="Seu e-mail" type="email" placeholder="voce@suaempresa.com.br" value={data.email} onChange={e => update({ email: e.target.value })} hint="Vai ser o seu login." />
        <Input label="Senha" type="password" placeholder="mínimo 6 caracteres" value={data.password} onChange={e => update({ password: e.target.value })} hint="Use uma senha forte." />
      </div>
    </div>
  </div>
);

window.OnboardingWizard = OnboardingWizard;
