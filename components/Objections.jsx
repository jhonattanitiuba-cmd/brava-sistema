/* global React, WA_LINK */

const OBJECTIONS = [
  { q: 'Mas eu já uso o WhatsApp Business…',         a: 'O WhatsApp Business é ótimo pra começar. Mas ele não tem CRM, funil, agente de IA, analytics nem white-label. Quando sua operação cresce, ele vira gargalo. A Brava começa onde o WhatsApp Business para.' },
  { q: 'Achei caro pro tamanho da minha operação…',  a: 'A pergunta certa não é se cabe no orçamento. É: quanto você está perdendo hoje em leads não respondidos, follow-ups esquecidos e atendentes pouco produtivos? Em alguns clientes a plataforma se paga em 1-2 meses. Te mostro a conta na demonstração.' },
  { q: 'Já tentei outro CRM e meu time não usou…',   a: 'Provavelmente porque era genérico, feito pra todo mundo, configurado pra ninguém. A Brava entra com configuração guiada: a gente coleta como sua empresa funciona e deixa os agentes prontos. Sua equipe usa porque os agentes já respondem do jeito de vocês.' },
  { q: 'Vou ter que treinar a equipe?',               a: 'A interface é parecida com o WhatsApp Web. Quem usa WhatsApp já sabe usar. E entregamos o sistema configurado. Em poucos dias todo mundo está operando.' },
  { q: 'Estou usando Evolution API. Vou tomar ban?',  a: 'Não. Trabalhamos com práticas que mantêm o número estável. E pros planos Performance pra cima dá pra migrar pra Cloud API oficial da Meta sem dor. Te oriento sobre o melhor caminho na demonstração.' },
  { q: 'Eu já tenho site. Não preciso de outro.',     a: 'Tudo bem. O site é um bônus do plano Performance, não obrigação. Se você já tem um site funcionando, integramos com o CRM da Brava sem trocar nada. Mas é comum o cliente decidir migrar depois, porque o nosso é construído pra converter, não só pra ser vitrine.' },
];

function Objections() {
  return (
    <section className="section dark" id="objecoes">
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Quebra de objecoes</div>
          <h2 className="h2" style={{ marginTop:18 }}>
            As <span className="gradient-text">duvidas honestas</span> que voce tem agora.
          </h2>
          <p className="sec-sub">Cada objecao abaixo foi ouvida de um cliente real. As respostas tambem sao reais.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(360px,1fr))', gap:14 }}>
          {OBJECTIONS.map((o, i) => (
            <div key={i} style={{
              background:'var(--bg-card)',
              border:'1px solid var(--border-dark-soft)',
              borderRadius:16, padding:28, position:'relative',
              transition:'border-color .25s, transform .25s cubic-bezier(.22,1,.36,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(123,63,228,.3)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-dark-soft)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
                <span style={{
                  flex:'0 0 32px', width:32, height:32, borderRadius:999,
                  background:'var(--brava-gradient)', color:'#fff',
                  display:'grid', placeItems:'center',
                  fontFamily:'Inter', fontWeight:700, fontSize:13
                }}>{String(i+1).padStart(2,'0')}</span>
                <h3 style={{ margin:0, fontSize:18, fontWeight:600, letterSpacing:'-.01em', lineHeight:1.25, color:'var(--text-primary)' }}>{o.q}</h3>
              </div>
              <p style={{ margin:0, marginLeft:46, color:'var(--text-secondary)', fontSize:15, lineHeight:1.6 }}>{o.a}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:56 }}>
          <p style={{ color:'var(--text-secondary)', fontSize:16, marginBottom:20 }}>
            Ficou alguma duvida? Vem conversar direto com a gente.
          </p>
          <a href={WA_LINK} className="btn btn-primary">
            Tirar duvida no WhatsApp
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="section dark" id="garantia">
      <div className="glow-blob purple" style={{ width:500, height:500, top:-100, left:'50%', transform:'translateX(-50%)', opacity:0.28 }}></div>
      <div className="container" style={{ maxWidth:920 }}>
        <div style={{
          padding:56,
          background:'var(--bg-card)',
          border:'1px solid var(--border-dark-soft)',
          borderRadius:24, position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--brava-gradient)' }}></div>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:40, alignItems:'center' }} className="guarantee-grid">
            <div style={{
              width:160, height:160, borderRadius:'50%',
              background:'linear-gradient(135deg, rgba(123,63,228,0.12), rgba(30,144,255,0.12))',
              border:'2px solid rgba(123,63,228,0.35)',
              display:'grid', placeItems:'center'
            }}>
              <div style={{ textAlign:'center' }}>
                <div className="mono" style={{ fontSize:10, color:'var(--text-tertiary)', letterSpacing:'.1em' }}>GARANTIA</div>
                <div style={{ fontFamily:'Inter', fontSize:56, fontWeight:700, lineHeight:1, background:'var(--brava-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>7</div>
                <div className="mono" style={{ fontSize:10, color:'var(--text-tertiary)', letterSpacing:'.1em' }}>DIAS</div>
              </div>
            </div>
            <div>
              <div className="eyebrow"><span className="dot"></span>Garantia incondicional</div>
              <h2 className="h2" style={{ marginTop:16, fontSize:36 }}>
                Configura, testa, usa. Não gostou? <span className="gradient-text">Devolvo tudo.</span>
              </h2>
              <p style={{ marginTop:20, fontSize:17, color:'var(--text-secondary)', lineHeight:1.55 }}>
                Se em 7 dias você sentir que a Brava não é o que sua empresa precisa, devolvemos 100% do que você pagou. Sem perguntas, sem burocracia, sem aquela conversa de tem certeza?.
              </p>
              <p style={{ marginTop:16, fontSize:15, color:'var(--text-tertiary)', fontStyle:'italic', lineHeight:1.5 }}>
                Prefiro perder uma venda do que ganhar um cliente insatisfeito. É assim que a Brava cresce: com clientes que ficam porque a plataforma entrega, não porque assinaram contrato preso.
              </p>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 760px) { .guarantee-grid { grid-template-columns: 1fr !important; justify-items: center; text-align: center; } }`}</style>
      </div>
    </section>
  );
}

function Urgency() {
  const [slots] = React.useState({ total: 8, taken: 5 });
  const remaining = slots.total - slots.taken;
  return (
    <section className="section dark" id="urgencia">
      <div className="container" style={{ maxWidth:980 }}>
        <div style={{ padding:1.5, borderRadius:24, background:'var(--brava-gradient)' }}>
          <div style={{
            background:'var(--bg-card)',
            borderRadius:23, padding:48,
            display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:48, alignItems:'center'
          }} className="urg-grid">
            <div>
              <div className="eyebrow"><span className="dot"></span>Capacidade limitada</div>
              <h2 className="h2" style={{ marginTop:16 }}>
                Atendemos um número limitado de <span className="gradient-text">implementações por mês</span>.
              </h2>
              <p style={{ marginTop:20, fontSize:17, color:'var(--text-secondary)', lineHeight:1.55 }}>
                Não é firula de marketing. A Brava entra em cada cliente com configuração guiada: nosso time entende sua operação antes do agente IA começar a responder. Por isso abrimos 8 vagas por mês.
              </p>
              <p style={{ marginTop:16, fontSize:16, fontWeight:600, color:'var(--text-primary)' }}>
                Hoje ainda tem vaga. Amanhã eu não sei.
              </p>
            </div>
            <div>
              <div className="mono" style={{ fontSize:10.5, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--text-tertiary)', textAlign:'center', marginBottom:16 }}>
                Jun/2026 · vagas de implementação
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
                {Array.from({ length: slots.total }).map((_,i) => (
                  <div key={i} style={{
                    aspectRatio:'1', borderRadius:10,
                    background: i < slots.taken ? 'var(--brava-gradient)' : 'transparent',
                    border: i < slots.taken ? 'none' : '1.5px dashed var(--border-dark)',
                    display:'grid', placeItems:'center',
                    color: i < slots.taken ? '#fff' : 'var(--text-tertiary)',
                    fontFamily:'Inter', fontWeight:600, fontSize:18
                  }}>
                    {i < slots.taken
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      : (i+1)}
                  </div>
                ))}
              </div>
              <div style={{
                padding:16,
                background:'linear-gradient(135deg,rgba(123,63,228,0.1),rgba(30,144,255,0.1))',
                border:'1px solid rgba(123,63,228,0.22)',
                borderRadius:12, textAlign:'center'
              }}>
                <div style={{ fontFamily:'Inter', fontSize:36, fontWeight:700, lineHeight:1, background:'var(--brava-gradient)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{remaining}</div>
                <div className="mono" style={{ fontSize:10.5, marginTop:4, color:'var(--text-secondary)', letterSpacing:'.08em', textTransform:'uppercase' }}>vagas restantes</div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 820px) { .urg-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

window.Objections = Objections;
window.Guarantee  = Guarantee;
window.Urgency    = Urgency;
