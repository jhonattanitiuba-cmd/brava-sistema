// Painel · os numeros vivos do rebanho (contador com catraca).
(function () {
  const { useEffect } = React;
  const { Card, StatCounter, NucleoDot, ProgressBar, Icon, Screen, SectionTitle, Chip } = window.BN;

  const TOM = {
    accent: 'var(--bn-accent)', good: 'var(--bn-good)',
    alert: 'var(--bn-alert)', warn: 'var(--bn-warn)', muted: 'var(--bn-text)',
  };

  function PainelScreen() {
    const M = window.MOCK;
    const P = M.painel;

    useEffect(() => {
      // catraca acompanha a contagem (crescendo). Cascata dura ~1.8s.
      const stop = window.BNRatchet.play(1800);
      return () => stop && stop();
    }, []);

    const maxFrente = Math.max(...P.porFrente.map(f => f.pessoas));
    const maxCaminhada = Math.max(...P.caminhada.map(c => c.qtd));

    return (
      <Screen>
        <SectionTitle
          eyebrow="O rebanho agora"
          title="O olhar sobre o todo"
          right={<Chip icon="Clock">Atualizado ha instantes</Chip>}
        />

        {/* Destaques com contador animado */}
        <div className="bn-grid cols-4">
          {P.destaques.map((d, i) => (
            <Card key={d.id} className="bn-stat">
              <div className="bn-between">
                <span className="bn-stat-ico" style={{ color: TOM[d.tom] }}><Icon name={d.icon} size={18} /></span>
                <span className="bn-sm" style={{ color: TOM[d.tom], fontWeight: 'var(--fw-medium)' }}>{d.tendencia}</span>
              </div>
              <div className="bn-stat-num" style={{ color: TOM[d.tom] }}>
                <StatCounter value={d.valor} delay={120 + i * 140} duration={1500} />
              </div>
              <div className="bn-sm bn-muted">{d.label}</div>
            </Card>
          ))}
        </div>

        <div className="bn-grid cols-2" style={{ marginTop: 'var(--sp-4)' }}>
          {/* Por frente */}
          <Card>
            <div className="bn-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h3 className="bn-h3">Pessoas por frente</h3>
              <Icon name="Layers" size={18} style={{ color: 'var(--bn-text-3)' }} />
            </div>
            <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
              {P.porFrente.map((f) => {
                const n = M.nucleoById[f.nucleo];
                return (
                  <div key={f.nucleo}>
                    <div className="bn-between" style={{ marginBottom: 6 }}>
                      <span className="bn-row" style={{ gap: 'var(--sp-2)' }}><NucleoDot nucleoId={f.nucleo} /><span className="bn-sm">{n.nome}</span></span>
                      <span className="bn-sm bn-num" style={{ fontWeight: 'var(--fw-strong)' }}>{f.pessoas}</span>
                    </div>
                    <ProgressBar value={f.pessoas} total={maxFrente} color={n.cor} />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Caminhada (funil) */}
          <Card>
            <div className="bn-between" style={{ marginBottom: 'var(--sp-4)' }}>
              <h3 className="bn-h3">A caminhada de quem chega</h3>
              <Icon name="Route" size={18} style={{ color: 'var(--bn-text-3)' }} />
            </div>
            <div className="bn-stack" style={{ gap: 'var(--sp-3)' }}>
              {P.caminhada.map((c, i) => (
                <div key={c.etapa} className="bn-funnel-row">
                  <div className="bn-funnel-bar" style={{ width: (30 + 70 * (c.qtd / maxCaminhada)) + '%', animationDelay: (i * 90) + 'ms' }}>
                    <span className="bn-sm">{c.etapa}</span>
                    <span className="bn-sm bn-num" style={{ fontWeight: 'var(--fw-strong)' }}>{c.qtd}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Por setor */}
        <Card style={{ marginTop: 'var(--sp-4)' }}>
          <div className="bn-between" style={{ marginBottom: 'var(--sp-4)' }}>
            <h3 className="bn-h3">Rebanho por setor</h3>
            <Icon name="MapPin" size={18} style={{ color: 'var(--bn-text-3)' }} />
          </div>
          <div className="bn-grid cols-4">
            {P.porSetor.map((s) => (
              <div key={s.setor} className="bn-setor">
                <div className="bn-num bn-h2" style={{ color: 'var(--bn-text)' }}>{s.pessoas}</div>
                <div className="bn-sm" style={{ fontWeight: 'var(--fw-medium)' }}>{s.setor}</div>
                <div className="bn-sm bn-faint">{s.celulas} celulas</div>
              </div>
            ))}
            <div className="bn-setor bn-setor-cta">
              <Icon name="TrendingUp" size={20} style={{ color: 'var(--bn-accent)' }} />
              <div className="bn-sm bn-muted">O rebanho cresceu em todos os setores este mes.</div>
            </div>
          </div>
        </Card>
      </Screen>
    );
  }

  (window.BN_SCREENS = window.BN_SCREENS || {}).painel = PainelScreen;
})();
