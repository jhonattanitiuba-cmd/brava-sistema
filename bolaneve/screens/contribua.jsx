// Contribua · Faca Parte da campanha Em Marcha (dizimos e ofertas).
(function () {
  const { useState } = React;
  const { Card, Button, Chip, Icon, Screen, SectionTitle } = window.BN;

  function copiar(texto, done) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(done, done);
        return;
      }
    } catch (e) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
    done();
  }

  function CopyRow({ rotulo, valor, icon }) {
    const [ok, setOk] = useState(false);
    const go = () => { copiar(valor, () => { setOk(true); setTimeout(() => setOk(false), 1800); }); };
    return (
      <div className="bn-copyrow">
        <span className="bn-copy-ico"><Icon name={icon} size={16} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bn-sm bn-faint">{rotulo}</div>
          <div className="bn-sm" style={{ fontWeight: 'var(--fw-medium)', wordBreak: 'break-word' }}>{valor}</div>
        </div>
        <button className={`bn-copy-btn ${ok ? 'ok' : ''}`} onClick={go} title="Copiar">
          <Icon name={ok ? 'Check' : 'Copy'} size={15} />
          <span className="bn-sm">{ok ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>
    );
  }

  function ContribuaScreen() {
    const C = window.MOCK.contribuicao;

    return (
      <Screen>
        <SectionTitle
          eyebrow="Faca parte"
          title="Contribua"
          right={<Chip icon="HeartHandshake">Dizimos e ofertas</Chip>}
        />

        {/* Campanha Em Marcha */}
        <Card className="bn-marcha">
          <div className="bn-marcha-body">
            <div className="bn-eyebrow" style={{ marginBottom: 'var(--sp-3)' }}><span className="dot" />Campanha</div>
            <h2 className="bn-marcha-title">Em Marcha</h2>
            <div className="bn-marcha-lema">{C.lema}</div>
            <div className="bn-marcha-grito">
              {C.grito.map((g, i) => <span key={i}>{g}</span>)}
            </div>
            <p className="bn-muted" style={{ marginTop: 'var(--sp-4)', maxWidth: 620 }}>{C.texto}</p>
          </div>
        </Card>

        <div className="bn-grid cols-2" style={{ marginTop: 'var(--sp-4)' }}>
          {/* PIX */}
          <Card className="bn-give">
            <div className="bn-row" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
              <span className="bn-give-ico"><Icon name="HeartHandshake" size={18} /></span>
              <h3 className="bn-h3">Contribuir pelo PIX</h3>
            </div>
            <p className="bn-sm bn-muted" style={{ marginBottom: 'var(--sp-4)' }}>{C.chamada}</p>
            <CopyRow rotulo={`Chave PIX (${C.pixTipo})`} valor={C.pixChave} icon="Mail" />
            <div className="bn-give-hint">
              <Icon name="Info" size={14} style={{ color: 'var(--bn-gold)' }} />
              <span className="bn-sm bn-faint">Copie a chave e finalize no app do seu banco.</span>
            </div>
          </Card>

          {/* Transferencia */}
          <Card className="bn-give">
            <div className="bn-row" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
              <span className="bn-give-ico"><Icon name="Landmark" size={18} /></span>
              <h3 className="bn-h3">Transferencia</h3>
            </div>
            <div className="bn-stack" style={{ gap: 'var(--sp-2)' }}>
              <CopyRow rotulo="Titular" valor={C.banco.titular} icon="Building2" />
              <CopyRow rotulo="Agencia" valor={C.banco.agencia} icon="Landmark" />
              <CopyRow rotulo="Conta" valor={C.banco.conta} icon="Landmark" />
            </div>
          </Card>
        </div>

        <Card className="bn-give-note">
          <Icon name="Sparkles" size={16} style={{ color: 'var(--bn-gold)' }} />
          <span className="bn-sm bn-muted">Cada contribuicao sustenta a obra e o avanco do rebanho. Com gratidao, seguimos em marcha rumo a promessa.</span>
        </Card>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).contribua = ContribuaScreen;
})();
