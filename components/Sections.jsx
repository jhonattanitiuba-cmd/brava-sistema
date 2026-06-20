/* global React, FeatureIcon */

function PainBlock() {
  const pains = [
    { t: 'Resposta que demora', d: 'O cliente manda mensagem e a resposta vem horas depois. Quando chega, ele ja comprou de outro.' },
    { t: 'Nada conversa entre si', d: 'Contato no celular de um, planilha com outro, contrato perdido no e-mail. Cada parte da operacao vive numa ilha.' },
    { t: 'Nenhum numero claro', d: 'Voce nao sabe quantos leads chegaram, quanto entrou no caixa, nem onde a operacao esta travando.' },
    { t: 'Cada um faz de um jeito', d: 'Sem processo, cada pessoa atende, orca e cobra do seu jeito. O resultado fica imprevisivel.' },
    { t: 'A carteira vai embora junto', d: 'Quando alguem sai da equipe, leva contatos e historico que deveriam ser da empresa.' },
    { t: 'Nao sabe por onde comecar', d: 'Voce sabe que precisa de tecnologia, mas falta um parceiro que entenda a operacao inteira.' },
  ];
  return (
    <section className="section dark" id="dor">
      <div className="grid-bg" style={{ opacity: 0.5 }}></div>
      <div className="glow-blob purple" style={{ width: 380, height: 380, top: 80, left: '18%', opacity: 0.22 }}></div>
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Reconhece alguma?</div>
          <h2 className="h2" style={{ marginTop: 18 }}>
            O que costuma <span className="gradient-text">travar a operacao</span> antes de virar venda.
          </h2>
          <p className="sec-sub">Situacoes comuns no dia a dia. Quantas voce reconhece na sua empresa?</p>
        </div>
        <div className="pain-grid">
          {pains.map((p, i) => (
            <div key={i} className="pain-card">
              <div className="pain-icon">
                <FeatureIcon text={p.t} size={18} color="#FF8888" tile={false}/>
              </div>
              <div>
                <div className="pain-title">{p.t}</div>
                <div className="pain-desc">{p.d}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="pain-cta-text">Reconheceu tres ou mais? E exatamente isso que a plataforma organiza para voce.</p>
      </div>
    </section>
  );
}

window.PainBlock = PainBlock;
