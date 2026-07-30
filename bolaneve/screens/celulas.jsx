// Mapa · a geografia do rebanho (bolinhas por nucleo e por celula).
(function () {
  const { useState } = React;
  const { Card, Button, Chip, NucleoDot, Icon, Screen, SectionTitle } = window.BN;

  function CelulasScreen() {
    const M = window.MOCK;
    const [sel, setSel] = useState(M.celulas[0]);

    return (
      <Screen>
        <SectionTitle
          eyebrow="Onde o rebanho esta"
          title="Mapa das celulas"
          right={<Chip icon="Users">{M.celulas.reduce((a, c) => a + c.membros, 0)} pessoas em celula</Chip>}
        />

        <div className="bn-mapwrap">
          {/* Mapa */}
          <Card pad={0} className="bn-map">
            <div className="bn-map-canvas">
              <div className="bn-map-grid" />
              <div className="bn-map-road r1" /><div className="bn-map-road r2" /><div className="bn-map-road v1" />
              {M.celulas.map((c) => {
                const n = M.nucleoById[c.nucleo];
                const active = sel.id === c.id;
                return (
                  <button key={c.id}
                    className={`bn-pin ${active ? 'active' : ''}`}
                    style={{ left: c.x + '%', top: c.y + '%', '--pin': n.cor }}
                    onClick={() => setSel(c)} title={c.nome}>
                    <span className="bn-pin-dot" />
                    <span className="bn-pin-ring" />
                    {active && <span className="bn-pin-label">{c.nome}</span>}
                  </button>
                );
              })}
            </div>
            {/* Legenda */}
            <div className="bn-map-legend">
              {M.nucleos.map((n) => (
                <span key={n.id} className="bn-row" style={{ gap: 'var(--sp-2)' }}>
                  <NucleoDot nucleoId={n.id} size={9} />
                  <span className="bn-sm bn-muted">{n.nome}</span>
                </span>
              ))}
            </div>
          </Card>

          {/* Detalhe + proximas */}
          <div className="bn-map-side">
            <Card>
              <div className="bn-row" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                <NucleoDot nucleoId={sel.nucleo} size={14} />
                <div>
                  <h3 className="bn-h3">{sel.nome}</h3>
                  <div className="bn-sm bn-muted">{M.nucleoById[sel.nucleo].nome}</div>
                </div>
              </div>
              <div className="bn-stack" style={{ gap: 'var(--sp-3)' }}>
                <div className="bn-info"><Icon name="MapPin" size={16} /><span className="bn-sm">{sel.bairro}</span></div>
                <div className="bn-info"><Icon name="Clock" size={16} /><span className="bn-sm">{sel.dia}</span></div>
                <div className="bn-info"><Icon name="UsersRound" size={16} /><span className="bn-sm">{sel.lider}</span></div>
                <div className="bn-info"><Icon name="Users" size={16} /><span className="bn-sm">{sel.membros} membros</span></div>
              </div>
              <Button variant="primary" icon="UserCheck" className="block" style={{ marginTop: 'var(--sp-5)' }}>Encaminhar alguem para ca</Button>
            </Card>

            <Card>
              <h3 className="bn-h3" style={{ marginBottom: 'var(--sp-4)' }}>Celulas por perto</h3>
              <div className="bn-stack" style={{ gap: 6 }}>
                {M.celulas.slice(0, 5).map((c) => (
                  <button key={c.id} className={`bn-cell-row ${sel.id === c.id ? 'active' : ''}`} onClick={() => setSel(c)}>
                    <NucleoDot nucleoId={c.nucleo} size={9} />
                    <span className="bn-sm" style={{ flex: 1, textAlign: 'left', fontWeight: 'var(--fw-medium)' }}>{c.nome}</span>
                    <span className="bn-sm bn-faint">{c.bairro}</span>
                    <Icon name="ChevronRight" size={15} style={{ color: 'var(--bn-text-3)' }} />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).celulas = CelulasScreen;
})();
