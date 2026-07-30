// Biblia inteligente · a Palavra no dia a dia (ler, grifar, devocional).
(function () {
  const { useState } = React;
  const { Card, Button, Chip, Icon, Screen } = window.BN;

  function BibliaScreen({ navigate }) {
    const M = window.MOCK;
    const T = M.bibliaTexto;
    const [aba, setAba] = useState('antigo');
    const [grifados, setGrifados] = useState({ 4: true }); // v4 ja grifado no demo
    const [devOpen, setDevOpen] = useState(false);
    const [salvo, setSalvo] = useState(false);

    const toggle = (n) => setGrifados(g => ({ ...g, [n]: !g[n] }));
    const nGrifados = Object.values(grifados).filter(Boolean).length;

    return (
      <Screen>
        <div className="bn-biblia">
          {/* Navegador de livros */}
          <Card pad={0} className="bn-bible-nav">
            <div className="bn-tabs">
              <button className={`bn-tab ${aba === 'antigo' ? 'active' : ''}`} onClick={() => setAba('antigo')}>Antigo</button>
              <button className={`bn-tab ${aba === 'novo' ? 'active' : ''}`} onClick={() => setAba('novo')}>Novo</button>
            </div>
            <div className="bn-book-list">
              {M.bibliaLivros[aba].map((livro) => (
                <button key={livro} className={`bn-book ${livro === T.livro ? 'active' : ''}`}>
                  <Icon name="BookOpen" size={15} />
                  <span className="bn-sm">{livro}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Leitor */}
          <div className="bn-reader">
            <Card>
              <div className="bn-between" style={{ marginBottom: 'var(--sp-5)', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                <div>
                  <div className="bn-eyebrow"><span className="dot" />Leitura</div>
                  <h2 className="bn-h1" style={{ marginTop: 6 }}>{T.livro} {T.capitulo}</h2>
                </div>
                <div className="bn-row" style={{ gap: 'var(--sp-2)' }}>
                  <button className="bn-icon-btn" title={salvo ? 'Salvo' : 'Salvar'} onClick={() => setSalvo(s => !s)}>
                    <Icon name="Bookmark" size={18} style={{ color: salvo ? 'var(--bn-accent)' : 'var(--bn-text-2)' }} />
                  </button>
                  <Button variant="default" icon="Download" onClick={() => navigate('baixar')}>Baixar</Button>
                </div>
              </div>

              <div className="bn-verses">
                {T.versiculos.map((v, i) => (
                  <p key={v.n}
                    className={`bn-verse ${grifados[v.n] ? 'grifado' : ''}`}
                    style={{ animationDelay: (80 + i * 70) + 'ms' }}
                    onClick={() => toggle(v.n)}>
                    <span className="bn-verse-n">{v.n}</span>
                    <span>{v.txt}</span>
                  </p>
                ))}
              </div>

              <div className="bn-reader-bar">
                <span className="bn-sm bn-muted">
                  <Icon name="Highlighter" size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                  {nGrifados > 0 ? `${nGrifados} versiculo(s) grifado(s)` : 'Toque num versiculo para grifar'}
                </span>
                <Button variant="primary" icon="Sparkles" onClick={() => setDevOpen(true)} disabled={nGrifados === 0}>Gerar devocional</Button>
              </div>
            </Card>

            {/* Devocional gerado */}
            {devOpen && (
              <Card className="bn-dev-gen">
                <div className="bn-between" style={{ marginBottom: 'var(--sp-3)' }}>
                  <div className="bn-eyebrow"><span className="dot" />Devocional gerado</div>
                  <button className="bn-icon-btn" onClick={() => setDevOpen(false)}><Icon name="X" size={16} /></button>
                </div>
                <h3 className="bn-h3" style={{ marginBottom: 'var(--sp-2)' }}>O pastor que caminha no vale</h3>
                <p style={{ lineHeight: 1.6 }}>{T.oticaHoje}</p>
                <div className="bn-row" style={{ gap: 'var(--sp-2)', marginTop: 'var(--sp-5)' }}>
                  <Button variant="primary" icon="CheckCircle2" onClick={() => navigate('devocionais')}>Salvar na minha jornada</Button>
                  <Chip icon="Clock">Guardado para amanha</Chip>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).biblia = BibliaScreen;
})();
