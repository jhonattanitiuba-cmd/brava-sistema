// Acolhimento · o bom pastor que vai atras da ovelha que chegou.
(function () {
  const { useState } = React;
  const { Card, Button, Chip, NucleoDot, Avatar, Icon, Screen, SectionTitle } = window.BN;

  const STATUS = {
    novo:     { label: 'Novo', cor: 'var(--bn-accent)', soft: 'var(--bn-accent-soft)' },
    acolhido: { label: 'Acolhido', cor: 'var(--bn-good)', soft: 'var(--bn-good-soft)' },
    visita:   { label: 'Precisa visita', cor: 'var(--bn-alert)', soft: 'var(--bn-alert-soft)' },
  };

  function AcolhimentoScreen({ navigate }) {
    const M = window.MOCK;
    const [sel, setSel] = useState(M.visitantes[0]);
    const cel = M.celulas.find(c => c.id === sel.celulaSugerida);

    return (
      <Screen>
        <SectionTitle
          eyebrow="Quem chegou"
          title="Acolhimento"
          right={<Chip dotColor="var(--bn-good)">Agente online</Chip>}
        />

        <div className="bn-acol">
          {/* Lista */}
          <Card pad={0} className="bn-acol-list">
            <div className="bn-acol-head">
              <span className="bn-row" style={{ gap: 'var(--sp-2)' }}><Icon name="Inbox" size={17} /><span className="bn-sm" style={{ fontWeight: 'var(--fw-strong)' }}>Chegando do WhatsApp</span></span>
              <span className="bn-chip">{M.visitantes.length}</span>
            </div>
            <div className="bn-acol-scroll">
              {M.visitantes.map((v) => {
                const st = STATUS[v.status];
                return (
                  <button key={v.id} className={`bn-acol-item ${sel.id === v.id ? 'active' : ''}`} onClick={() => setSel(v)}>
                    <Avatar name={v.nome} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="bn-between">
                        <span className="bn-sm" style={{ fontWeight: 'var(--fw-strong)' }}>{v.nome}</span>
                        <span className="bn-sm bn-faint" style={{ fontSize: 'var(--fs-xs)' }}>{v.quando}</span>
                      </div>
                      <div className="bn-sm bn-muted bn-clamp" style={{ marginTop: 2 }}>{v.ultima}</div>
                      <span className="bn-tag" style={{ color: st.cor, background: st.soft, marginTop: 6 }}>{st.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Detalhe + conversa */}
          <div className="bn-acol-detail">
            <Card>
              <div className="bn-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                <div className="bn-row" style={{ gap: 'var(--sp-3)' }}>
                  <Avatar name={sel.nome} size={52} nucleoId={cel && cel.nucleo} />
                  <div>
                    <h3 className="bn-h3">{sel.nome}</h3>
                    <div className="bn-sm bn-muted">{sel.momento}</div>
                  </div>
                </div>
                <span className="bn-tag" style={{ color: STATUS[sel.status].cor, background: STATUS[sel.status].soft }}>{STATUS[sel.status].label}</span>
              </div>

              <div className="bn-grid cols-3" style={{ marginTop: 'var(--sp-5)' }}>
                <div className="bn-info"><Icon name="Phone" size={16} /><div><div className="bn-sm bn-faint">Telefone</div><div className="bn-sm">{sel.telefone}</div></div></div>
                <div className="bn-info"><Icon name="MapPin" size={16} /><div><div className="bn-sm bn-faint">Bairro</div><div className="bn-sm">{sel.bairro}</div></div></div>
                <div className="bn-info"><Icon name="Heart" size={16} /><div><div className="bn-sm bn-faint">Momento</div><div className="bn-sm">{sel.momento}</div></div></div>
              </div>
            </Card>

            {/* Sugestao de celula */}
            {cel && (
              <Card className="bn-suggest">
                <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-3)' }}><span className="dot" />Celula mais proxima</div>
                <div className="bn-between" style={{ flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                  <div className="bn-row" style={{ gap: 'var(--sp-3)' }}>
                    <NucleoDot nucleoId={cel.nucleo} size={14} />
                    <div>
                      <div style={{ fontWeight: 'var(--fw-strong)' }}>{cel.nome}</div>
                      <div className="bn-sm bn-muted">{cel.bairro} {String.fromCharCode(183)} {cel.dia} {String.fromCharCode(183)} {cel.lider}</div>
                    </div>
                  </div>
                  <div className="bn-row" style={{ gap: 'var(--sp-2)' }}>
                    <Button variant="ghost" icon="MapPin" onClick={() => navigate('celulas')}>Ver no mapa</Button>
                    <Button variant="primary" icon="UserCheck">Conectar</Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Conversa do agente */}
            <Card pad={0} className="bn-chat">
              <div className="bn-chat-head">
                <span className="bn-row" style={{ gap: 'var(--sp-2)' }}><Icon name="MessageCircle" size={16} style={{ color: 'var(--bn-good)' }} /><span className="bn-sm" style={{ fontWeight: 'var(--fw-strong)' }}>Boas-vindas pelo agente</span></span>
                <Chip icon="Sparkles">Automatico</Chip>
              </div>
              <div className="bn-chat-body">
                {M.conversaAcolhimento.map((m, i) => (
                  <div key={i} className={`bn-msg ${m.de === 'agente' ? 'me' : ''}`}>
                    <div className="bn-bubble">{m.txt}</div>
                    <div className="bn-sm bn-faint" style={{ fontSize: 'var(--fs-micro)', marginTop: 3 }}>{m.hora}</div>
                  </div>
                ))}
              </div>
              <div className="bn-chat-foot">
                <Icon name="Sparkles" size={15} style={{ color: 'var(--bn-accent)' }} />
                <span className="bn-sm bn-muted">O agente ja fez o cadastro e sugeriu a celula. Nenhuma ovelha se perde.</span>
              </div>
            </Card>
          </div>
        </div>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).acolhimento = AcolhimentoScreen;
})();
