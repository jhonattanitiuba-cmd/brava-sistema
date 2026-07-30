// Captacao · o download que vira cadastro (email -> nome -> endereco).
(function () {
  const { useState, useEffect } = React;
  const { Card, Button, Chip, NucleoDot, Field, Icon, Screen } = window.BN;

  const KEY = 'bn_cadastro';
  const PASSOS = ['Contato', 'Identidade', 'Endereco', 'Pronto'];

  function CaptacaoScreen({ navigate }) {
    const M = window.MOCK;
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ email: '', telefone: '', nome: '', bairro: '' });
    const [canInstall, setCanInstall] = useState(!!window.__bnInstall);

    useEffect(() => {
      try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.nome) { setForm(s); setStep(3); } } catch (e) {}
      const on = () => setCanInstall(true);
      window.addEventListener('bn-installable', on);
      return () => window.removeEventListener('bn-installable', on);
    }, []);

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
    const save = (f) => { try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {} };

    const proximas = M.celulas
      .filter(c => !form.bairro || c.bairro.toLowerCase().includes(form.bairro.toLowerCase()))
      .slice(0, 3);
    const listaProximas = proximas.length ? proximas : M.celulas.slice(0, 3);

    const install = async () => {
      if (window.__bnInstall) { window.__bnInstall.prompt(); window.__bnInstall = null; setCanInstall(false); }
    };

    return (
      <Screen>
        <div className="bn-capt">
          <div className="bn-capt-aside">
            <div className="bn-eyebrow"><span className="dot" />Baixe e faca parte</div>
            <h1 className="bn-h1" style={{ marginTop: 'var(--sp-3)' }}>Leve a Palavra com voce.</h1>
            <p className="bn-muted" style={{ marginTop: 'var(--sp-3)' }}>
              Baixe a Biblia inteligente e, em poucos passos, a gente te conecta a uma celula
              pertinho de casa. Simples assim.
            </p>
            <div className="bn-capt-steps">
              {PASSOS.map((p, i) => (
                <div key={p} className={`bn-capt-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                  <span className="bn-capt-dot">{i < step ? <Icon name="Check" size={13} /> : i + 1}</span>
                  <span className="bn-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bn-capt-form">
            {step === 0 && (
              <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
                <h3 className="bn-h3">Como a gente fala com voce</h3>
                <Field label="E-mail" icon="Mail" type="email" value={form.email} onChange={set('email')} placeholder="voce@email.com" autoFocus />
                <Field label="Telefone" icon="Phone" value={form.telefone} onChange={set('telefone')} placeholder="(15) 99999-9999" />
                <Button variant="primary" iconRight="ArrowRight" className="block" onClick={() => setStep(1)} disabled={!form.email || !form.telefone}>Continuar</Button>
              </div>
            )}

            {step === 1 && (
              <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
                <h3 className="bn-h3">Seu nome</h3>
                <p className="bn-sm bn-muted" style={{ marginTop: '-8px' }}>Seu cadastro fica com o seu nome correto.</p>
                <Field label="Nome completo" icon="UserPlus" value={form.nome} onChange={set('nome')} placeholder="Como podemos te chamar" autoFocus />
                <div className="bn-row" style={{ gap: 'var(--sp-2)' }}>
                  <Button variant="ghost" icon="ArrowLeft" onClick={() => setStep(0)}>Voltar</Button>
                  <Button variant="primary" iconRight="ArrowRight" className="block" onClick={() => { save(form); setStep(2); }} disabled={!form.nome}>Criar cadastro</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
                <h3 className="bn-h3">Onde voce mora</h3>
                <p className="bn-sm bn-muted" style={{ marginTop: '-8px' }}>Assim mostramos as celulas mais proximas de voce.</p>
                <Field label="Bairro" icon="MapPin" value={form.bairro} onChange={set('bairro')} placeholder="Ex.: Campolim" autoFocus />
                <div className="bn-row" style={{ gap: 'var(--sp-2)' }}>
                  <Button variant="ghost" icon="ArrowLeft" onClick={() => setStep(1)}>Voltar</Button>
                  <Button variant="primary" iconRight="CheckCircle2" className="block" onClick={() => { save(form); setStep(3); }} disabled={!form.bairro}>Concluir</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bn-stack" style={{ gap: 'var(--sp-4)' }}>
                <div className="bn-capt-ok">
                  <span className="bn-capt-check"><Icon name="CheckCircle2" size={26} /></span>
                  <div>
                    <h3 className="bn-h3">Tudo certo, {(form.nome || '').split(' ')[0] || 'seja bem-vindo'}.</h3>
                    <div className="bn-sm bn-muted">Seu cadastro entrou no rebanho. Aqui estao as celulas por perto.</div>
                  </div>
                </div>

                <div className="bn-stack" style={{ gap: 6 }}>
                  {listaProximas.map((c) => (
                    <div key={c.id} className="bn-cell-row" style={{ cursor: 'default' }}>
                      <NucleoDot nucleoId={c.nucleo} size={9} />
                      <span className="bn-sm" style={{ flex: 1, fontWeight: 'var(--fw-medium)' }}>{c.nome}</span>
                      <span className="bn-sm bn-faint">{c.bairro} {String.fromCharCode(183)} {c.dia}</span>
                    </div>
                  ))}
                </div>

                <div className="bn-row" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {canInstall
                    ? <Button variant="primary" icon="Download" onClick={install}>Instalar o app</Button>
                    : <Chip icon="Smartphone">App pronto para instalar</Chip>}
                  <Button variant="default" icon="BookOpen" onClick={() => navigate('biblia')}>Abrir a Biblia</Button>
                  <Button variant="ghost" onClick={() => { try { localStorage.removeItem(KEY); } catch (e) {} setForm({ email: '', telefone: '', nome: '', bairro: '' }); setStep(0); }}>Fazer outro</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Screen>
    );
  }

  const S = (window.BN_SCREENS = window.BN_SCREENS || {});
  S.captacao = CaptacaoScreen;
})();
