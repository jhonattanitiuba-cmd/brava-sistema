// Hub · o ponto focal do projeto (o que o pastor ve primeiro).
(function () {
  const { Card, Button, Icon, Screen } = window.BN;

  function HubScreen({ navigate }) {
    const M = window.MOCK;
    return (
      <Screen>
        <div className="bn-hub-hero">
          <div className="bn-eyebrow"><span className="dot" />Ecossistema digital da igreja</div>
          <h1 className="bn-display" style={{ maxWidth: 760, marginTop: 'var(--sp-4)' }}>
            Toda a igreja em um lugar so.
          </h1>
          <p className="bn-muted" style={{ maxWidth: 560, fontSize: 17, marginTop: 'var(--sp-4)' }}>
            Um unico ambiente para enxergar o rebanho, acolher quem chega e aproximar
            cada pessoa da Palavra no dia a dia. A tecnologia a servico do proposito.
          </p>
          <div className="bn-row" style={{ marginTop: 'var(--sp-6)', flexWrap: 'wrap' }}>
            <Button variant="primary" icon="LayoutDashboard" onClick={() => navigate('painel')}>Entrar no painel</Button>
            <Button variant="default" icon="Download" onClick={() => navigate('baixar')}>Baixar a Biblia</Button>
          </div>
        </div>

        <div className="bn-hub-grid">
          {M.ambientes.map((a) => (
            <Card key={a.id} hoverable className="bn-hub-card" onClick={() => navigate(a.rota)}>
              <span className="bn-hub-ico"><Icon name={a.icon} size={22} /></span>
              <div style={{ flex: 1 }}>
                <div className="bn-between">
                  <h3 className="bn-h3">{a.nome}</h3>
                  <Icon name="ArrowRight" size={17} style={{ color: 'var(--bn-text-3)' }} />
                </div>
                <p className="bn-sm bn-muted" style={{ marginTop: 6 }}>{a.desc}</p>
              </div>
            </Card>
          ))}

          <Card className="bn-hub-card bn-hub-verse">
            <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-3)' }}><span className="dot" />Versiculo do ano</div>
            <p style={{ fontSize: 16, lineHeight: 1.5 }}>{M.igreja.versiculoAno}</p>
            <div className="bn-sm bn-faint" style={{ marginTop: 'var(--sp-3)' }}>{M.igreja.refAno}</div>
          </Card>
        </div>

        <Card className="bn-hub-arch">
          <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-4)' }}><span className="dot" />Como o ecossistema se organiza</div>
          <div className="bn-grid cols-3">
            <div className="bn-arch-col">
              <div className="bn-arch-k">Aplicativos</div>
              <div className="bn-sm bn-muted">Cinco ambientes, um login, um banco. Painel, acolhimento, mapa, Biblia e devocionais.</div>
            </div>
            <div className="bn-arch-col">
              <div className="bn-arch-k">Integracao</div>
              <div className="bn-sm bn-muted">WhatsApp captando, fluxos orquestrados e sessao segura por tras de tudo.</div>
            </div>
            <div className="bn-arch-col">
              <div className="bn-arch-k">Inteligencia</div>
              <div className="bn-sm bn-muted">Acolhimento que recebe, agente que explica a Palavra e uma voz que da as boas-vindas.</div>
            </div>
          </div>
        </Card>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).hub = HubScreen;
})();
