// Devocionais e planos · a caminhada com Deus (jornada, planos, historico).
(function () {
  const { useState } = React;
  const { Card, Button, Chip, ProgressBar, Icon, Screen, SectionTitle } = window.BN;

  function DevocionaisScreen({ navigate }) {
    const M = window.MOCK;
    const [lidos, setLidos] = useState(() => Object.fromEntries(M.devocionais.map(d => [d.id, d.lido])));
    const ativo = M.planos.find(p => p.ativo) || M.planos[0];

    return (
      <Screen>
        <SectionTitle eyebrow="A caminhada" title="Devocionais e planos" />

        {/* Plano em andamento */}
        <Card className="bn-plan-hero">
          <div className="bn-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-3)' }}><span className="dot" />Plano em andamento</div>
              <h3 className="bn-h2">{ativo.nome}</h3>
              <div className="bn-sm bn-muted" style={{ marginTop: 6 }}>Dia {ativo.progresso} de {ativo.total}. Continue de onde parou.</div>
              <div style={{ marginTop: 'var(--sp-4)', maxWidth: 420 }}>
                <ProgressBar value={ativo.progresso} total={ativo.total} height={8} />
              </div>
            </div>
            <Button variant="primary" icon="PlayCircle" onClick={() => navigate('biblia')}>Continuar leitura</Button>
          </div>
        </Card>

        <div className="bn-grid cols-3" style={{ marginTop: 'var(--sp-5)' }}>
          {/* Devocionais gerados */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="bn-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h3 className="bn-h3">Gerados a partir dos seus grifos</h3>
              <Chip icon="Sparkles">{M.devocionais.length}</Chip>
            </div>
            <div className="bn-stack" style={{ gap: 'var(--sp-3)' }}>
              {M.devocionais.map((d) => (
                <Card key={d.id} hoverable className="bn-dev-card">
                  <div className="bn-between" style={{ alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div className="bn-row" style={{ gap: 'var(--sp-2)', marginBottom: 6 }}>
                        <span className="bn-tag" style={{ color: 'var(--bn-accent)', background: 'var(--bn-accent-soft)' }}>{d.ref}</span>
                        <span className="bn-sm bn-faint">{d.data}</span>
                      </div>
                      <h4 className="bn-h3" style={{ fontSize: 16 }}>{d.titulo}</h4>
                      <p className="bn-sm bn-muted" style={{ marginTop: 6, fontStyle: 'italic' }}>"{d.trecho}"</p>
                      <p className="bn-sm" style={{ marginTop: 'var(--sp-3)', lineHeight: 1.55 }}>{d.corpo}</p>
                    </div>
                    <button className="bn-icon-btn" title={lidos[d.id] ? 'Lido' : 'Marcar como lido'}
                      onClick={() => setLidos(l => ({ ...l, [d.id]: !l[d.id] }))}>
                      <Icon name={lidos[d.id] ? 'CheckCircle2' : 'Check'} size={18} style={{ color: lidos[d.id] ? 'var(--bn-good)' : 'var(--bn-text-3)' }} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Planos + jornada */}
          <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
            <Card>
              <h3 className="bn-h3" style={{ marginBottom: 'var(--sp-4)' }}>Planos</h3>
              <div className="bn-stack" style={{ gap: 'var(--sp-3)' }}>
                {M.planos.map((p) => (
                  <div key={p.id} className="bn-plan-row">
                    <div className="bn-between" style={{ marginBottom: 6 }}>
                      <span className="bn-sm" style={{ fontWeight: 'var(--fw-medium)' }}>{p.nome}</span>
                      {p.ativo && <span className="bn-tag" style={{ color: 'var(--bn-accent)', background: 'var(--bn-accent-soft)' }}>Ativo</span>}
                    </div>
                    <ProgressBar value={p.progresso} total={p.total} />
                    <div className="bn-sm bn-faint" style={{ marginTop: 5 }}>{p.progresso}/{p.total} dias</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bn-journey">
              <div className="bn-row" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <Icon name="Star" size={16} style={{ color: 'var(--bn-warn)' }} />
                <span className="bn-sm" style={{ fontWeight: 'var(--fw-strong)' }}>Sua constancia</span>
              </div>
              <div className="bn-h1 bn-num">12 dias</div>
              <div className="bn-sm bn-muted">seguidos na Palavra. Da leitura para a pratica.</div>
            </Card>
          </div>
        </div>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).devocionais = DevocionaisScreen;
})();
