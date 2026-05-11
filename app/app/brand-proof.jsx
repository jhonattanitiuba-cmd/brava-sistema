// Brand Proof — establishes the Brava visual language before product screens.
// Sections: Logo lockup, Color palette, Typography, Component primitives.

const BrandProof = ({ onContinue }) => {
  const [logoMode, setLogoMode] = React.useState('gradient');

  return (
    <div className="bp-page">
      {/* Hero / Lockup */}
      <section className="bp-hero">
        <div className="bp-hero__inner">
          <div className="bp-hero__meta">
            <Badge variant="brand" icon="Sparkles">Brand foundation</Badge>
            <span className="bp-hero__version">v1.2 · maio 2026</span>
          </div>
          <h1 className="bp-hero__title">
            <span className="bp-hero__t1">Sistema</span>
            <span className="bp-hero__t2">Brava</span>
          </h1>
          <p className="bp-hero__sub">
            Fundação visual do CRM multi-tenant. Tudo que você ver daqui em diante — login, onboarding,
            workspace, painel admin — sai destes tokens. Premium B2B. Zero emoji. Gradiente roxo→azul como
            assinatura, nunca como ruído.
          </p>

          <div className="bp-lockup">
            <div className={`bp-lockup__stage bp-lockup__stage--${logoMode}`}>
              <Logo size={88} mode={logoMode === 'mono-light' ? 'mono' : logoMode === 'mono-dark' ? 'mono' : 'gradient'} />
            </div>
            <div className="bp-lockup__controls">
              {['gradient', 'mono-dark', 'mono-light'].map(m => (
                <button key={m} className={`bp-chip ${logoMode === m ? 'bp-chip--on' : ''}`} onClick={() => setLogoMode(m)}>
                  {m === 'gradient' ? 'Gradient' : m === 'mono-dark' ? 'Mono / dark' : 'Mono / light'}
                </button>
              ))}
            </div>
          </div>

          <div className="bp-hero__cta">
            <Button variant="primary" size="lg" iconRight="ArrowRight" onClick={() => onContinue('login')}>
              Continuar para o Login
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onContinue('onboarding')}>
              Pular para Onboarding
            </Button>
          </div>
        </div>
        <div className="bp-hero__grid" aria-hidden="true" />
      </section>

      {/* Color */}
      <section className="bp-section">
        <header className="bp-section__head">
          <span className="bp-section__num">01</span>
          <div>
            <h2 className="bp-section__title">Paleta</h2>
            <p className="bp-section__sub">Roxo→azul é assinatura. Off-white #F0F0F0 é o claro oficial — nunca branco puro.</p>
          </div>
        </header>

        <div className="bp-pal">
          <div className="bp-pal__hero">
            <div className="bp-pal__grad">
              <span className="bp-pal__grad-label">Brava Gradient</span>
              <code>linear-gradient(90deg, #7B3FE4, #1E90FF)</code>
            </div>
            <div className="bp-pal__brand">
              <Swatch name="Brava Purple" hex="#7B3FE4" token="--brava-purple" />
              <Swatch name="Brava Blue" hex="#1E90FF" token="--brava-blue" />
            </div>
          </div>

          <div className="bp-pal__row">
            <span className="bp-pal__row-title">Dark surfaces (default)</span>
            <Swatch name="Deep" hex="#000000" token="--bg-deep" dark />
            <Swatch name="Elevated" hex="#0E0E14" token="--bg-elevated" dark />
            <Swatch name="Card" hex="#15151E" token="--bg-card" dark />
            <Swatch name="Border" hex="#2A2A3A" token="--border-dark" dark />
          </div>

          <div className="bp-pal__row">
            <span className="bp-pal__row-title">Light surfaces</span>
            <Swatch name="Off-white" hex="#F0F0F0" token="--bg-light" />
            <Swatch name="Card" hex="#FFFFFF" token="--bg-light-card" />
            <Swatch name="Border" hex="#D8D8D8" token="--border-light" />
            <Swatch name="Ink" hex="#0A0A0F" token="--text-primary-light" dark />
          </div>

          <div className="bp-pal__row">
            <span className="bp-pal__row-title">Estados</span>
            <Swatch name="Success" hex="#1D9E75" token="--success" dark />
            <Swatch name="Warning" hex="#BA7517" token="--warning" dark />
            <Swatch name="Danger" hex="#A32D2D" token="--danger" dark />
            <Swatch name="Info" hex="#185FA5" token="--info" dark />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="bp-section">
        <header className="bp-section__head">
          <span className="bp-section__num">02</span>
          <div>
            <h2 className="bp-section__title">Tipografia</h2>
            <p className="bp-section__sub">Space Grotesk para display, Inter para corpo. Três pesos. Sem mais.</p>
          </div>
        </header>

        <div className="bp-type">
          <div className="bp-type__pair">
            <div className="bp-type__tag">Display · Space Grotesk</div>
            <div className="bp-type__sample bp-type__sample--display">
              <span className="bp-type__h1">Atendimento que escala.</span>
              <span className="bp-type__h2">Operação visível, ticket que justifica o preço.</span>
              <span className="bp-type__h3">Cabeçalhos de seção e KPIs grandes.</span>
            </div>
          </div>
          <div className="bp-type__pair">
            <div className="bp-type__tag">Body · Inter</div>
            <div className="bp-type__sample">
              <p className="bp-type__body">
                Corpo de texto a 17px com altura confortável e contraste alto. O Brava CRM roda em dark
                por padrão e usa light off-white quando o atendente prefere — mas o conteúdo, a hierarquia
                e o ritmo continuam idênticos.
              </p>
              <p className="bp-type__caption">Caption · 14px · usado em metadados, timestamps e legendas.</p>
            </div>
          </div>

          <div className="bp-type__scale">
            {[
              ['H1', '64', 700, 'Space Grotesk'],
              ['H2', '40', 500, 'Space Grotesk'],
              ['H3', '26', 500, 'Space Grotesk'],
              ['Body', '17', 400, 'Inter'],
              ['Small', '14', 500, 'Inter'],
            ].map(([label, size, w, fam]) => (
              <div key={label} className="bp-type__scale-row">
                <span className="bp-type__scale-label">{label}</span>
                <span className="bp-type__scale-size">{size}px</span>
                <span className="bp-type__scale-weight">{w}</span>
                <span className="bp-type__scale-fam">{fam}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="bp-section">
        <header className="bp-section__head">
          <span className="bp-section__num">03</span>
          <div>
            <h2 className="bp-section__title">Primitivos</h2>
            <p className="bp-section__sub">Botões, inputs, badges, cards. Cobre 80% da aplicação.</p>
          </div>
        </header>

        <div className="bp-prim">
          <Card>
            <div className="bp-prim__title">Botões</div>
            <div className="bp-prim__row">
              <Button variant="primary" icon="Sparkles">Gradient primary</Button>
              <Button variant="solid">Solid</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" icon="Trash2">Excluir</Button>
            </div>
            <div className="bp-prim__row">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg" iconRight="ArrowRight">Large</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </Card>

          <Card>
            <div className="bp-prim__title">Campos</div>
            <div className="bp-prim__inputs">
              <Input label="E-mail" icon="Mail" placeholder="voce@bravacompany.app.br" defaultValue="" />
              <Input label="Senha" icon="Lock" type="password" placeholder="••••••••" />
              <Input label="Slug do workspace" suffix=".brava.software" placeholder="estacionepark" />
              <Input label="Erro" icon="AlertCircle" defaultValue="ab" error="Mínimo de 10 caracteres" />
            </div>
          </Card>

          <Card>
            <div className="bp-prim__title">Badges & status</div>
            <div className="bp-prim__row">
              <Badge variant="brand" icon="Sparkles">IA ativa</Badge>
              <Badge variant="success" icon="Check">Resolvido</Badge>
              <Badge variant="warning" icon="Clock">Aguardando</Badge>
              <Badge variant="danger" icon="AlertTriangle">Fora do SLA</Badge>
              <Badge variant="info" icon="Info">Novo</Badge>
              <Badge variant="neutral">Beta</Badge>
            </div>
            <div className="bp-prim__row">
              <Avatar name="Jhonattan Souza" size={36} status="online" />
              <Avatar name="Gabriel Lima" size={36} status="online" />
              <Avatar name="Rafael Costa" size={36} status="offline" />
              <Avatar name="Maria Eduarda Pereira" size={36} />
              <Toggle checked={true} label="Modo escuro" onChange={() => {}} />
              <Toggle checked={false} label="Notificações" onChange={() => {}} />
            </div>
          </Card>

          <Card accent>
            <div className="bp-prim__title">Card destacado (accent gradient border)</div>
            <p className="bp-prim__p">
              Usado para o plano mais escolhido, item ativo do pipeline, ou um chamado em destaque.
              A borda pega o gradiente da marca; o conteúdo permanece neutro.
            </p>
            <div className="bp-prim__row">
              <Button variant="primary" size="sm" iconRight="ArrowRight">Selecionar plano</Button>
              <Button variant="ghost" size="sm">Comparar</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Principles */}
      <section className="bp-section bp-section--principles">
        <header className="bp-section__head">
          <span className="bp-section__num">04</span>
          <div>
            <h2 className="bp-section__title">Princípios visuais</h2>
            <p className="bp-section__sub">Decisões que sobrevivem a qualquer sprint.</p>
          </div>
        </header>

        <div className="bp-princ">
          {[
            ['Gradiente é assinatura, não fundo', 'Aplicado em CTAs, headlines com palavra-chave, bordas de destaque, ícones-chave. Nunca em corpo de texto longo nem em fundo de seção inteira.'],
            ['Zero emoji, sempre', 'Toda iconografia é Lucide (line, 1.5px). Status visuais usam cor, não pictograma. Empty states usam ícone monocromático grande a 30-40% de opacidade.'],
            ['Off-white > branco puro', 'Modo claro vive em #F0F0F0. Branco puro fica reservado para cards e superfícies elevadas — cria respiração sem aspecto clínico.'],
            ['Hierarquia carrega o sistema', 'Display em Space Grotesk dá identidade. Inter no corpo dá leitura. Três pesos — não cinco.'],
          ].map(([t, d], i) => (
            <div key={i} className="bp-princ__item">
              <span className="bp-princ__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="bp-princ__t">{t}</h3>
              <p className="bp-princ__d">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bp-footer">
        <div>
          <Logo size={32} />
          <span className="bp-footer__co">Brava Company S.A. · Alphaville, Barueri/SP</span>
        </div>
        <Button variant="primary" iconRight="ArrowRight" onClick={() => onContinue('login')}>Ver telas de produto</Button>
      </footer>
    </div>
  );
};

const Swatch = ({ name, hex, token, dark = false }) => (
  <div className={`bp-sw ${dark ? 'bp-sw--dark' : ''}`} style={{ background: hex }}>
    <div className="bp-sw__top">
      <span className="bp-sw__name">{name}</span>
    </div>
    <div className="bp-sw__bot">
      <span className="bp-sw__hex">{hex}</span>
      <span className="bp-sw__tok">{token}</span>
    </div>
  </div>
);

window.BrandProof = BrandProof;
