/* global React, WA_LINK */

const OBJECTIONS = [
  {
    q: 'Mas eu já uso o WhatsApp Business…',
    a: 'O WhatsApp Business é ótimo pra começar. Mas ele não tem CRM, funil, agente de IA, analytics nem white-label. Quando sua operação cresce, ele vira gargalo. A Brava começa onde o WhatsApp Business para.'
  },
  {
    q: 'Achei caro pro tamanho da minha operação…',
    a: 'A pergunta certa não é se cabe no orçamento. É: quanto você está perdendo hoje em leads não respondidos, follow-ups esquecidos e atendentes pouco produtivos? Em alguns clientes a plataforma se paga em 1-2 meses. Te mostro a conta na demonstração.'
  },
  {
    q: 'Já tentei outro CRM e meu time não usou…',
    a: 'Provavelmente porque era genérico, feito pra todo mundo, configurado pra ninguém. A Brava entra com configuração guiada: a gente coleta como sua empresa funciona e deixa os agentes prontos. Sua equipe usa porque os agentes já respondem do jeito de vocês.'
  },
  {
    q: 'Vou ter que treinar a equipe?',
    a: 'A interface é parecida com o WhatsApp Web. Quem usa WhatsApp já sabe usar. E entregamos o sistema configurado. Em poucos dias todo mundo está operando.'
  },
  {
    q: 'Estou usando Evolution API. Vou tomar ban?',
    a: 'Não. Trabalhamos com práticas que mantêm o número estável. E pros planos Performance pra cima dá pra migrar pra Cloud API oficial da Meta sem dor. Te oriento sobre o melhor caminho na demonstração.'
  },
  {
    q: 'Eu já tenho site. Não preciso de outro.',
    a: 'Tudo bem. O site é um bônus do plano Performance, não obrigação. Se você já tem um site funcionando, integramos com o CRM da Brava sem trocar nada. Mas é comum o cliente decidir migrar depois, porque o nosso é construído pra converter, não só pra ser vitrine.'
  }
];

function Objections() {
  return (
    <section className="section light" id="objecoes">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'6px 16px', borderRadius:999, background:'#1E90FF', color:'#fff', fontSize:11, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.12em', fontWeight:600, textTransform:'uppercase', boxShadow:'0 4px 14px rgba(30,144,255,.35)' }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.75)'}}/>
            Quebra de objeções
          </div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            As <span className="gradient-text">dúvidas honestas</span> que você tem agora.
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 16
        }}>
          {OBJECTIONS.map((o, i) => (
            <div key={i} style={{
              background: 'var(--bg-light-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 16,
              padding: 28,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{
                  flex: '0 0 32px',
                  width: 32, height: 32, borderRadius: 999,
                  background: 'var(--brava-gradient)',
                  color: '#fff',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'Space Grotesk',
                  fontWeight: 700, fontSize: 14
                }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 style={{
                  margin: 0, fontFamily: 'Space Grotesk',
                  fontSize: 19, fontWeight: 600,
                  letterSpacing: '-0.01em', lineHeight: 1.25
                }}>{o.q}</h3>
              </div>
              <p style={{ margin: 0, marginLeft: 46, color: 'var(--text-on-light-secondary)', fontSize: 15, lineHeight: 1.6 }}>{o.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="section dark" id="garantia">
      <div className="glow-blob purple" style={{ width: 500, height: 500, top: -100, left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}></div>
      <div className="container" style={{ maxWidth: 920 }}>
        <div style={{
          padding: 56,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-dark)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'var(--brava-gradient)'
          }}></div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 40,
            alignItems: 'center'
          }} className="guarantee-grid">
            <div style={{
              width: 160, height: 160,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(123,63,228,0.15), rgba(30,144,255,0.15))',
              border: '2px solid rgba(123,63,228,0.4)',
              display: 'grid', placeItems: 'center',
              position: 'relative'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>GARANTIA</div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 56, fontWeight: 700, lineHeight: 1, background: 'var(--brava-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.1em' }}>DIAS</div>
              </div>
            </div>
            <div>
              <div className="eyebrow"><span className="dot"></span>Garantia incondicional</div>
              <h2 className="h2" style={{ marginTop: 16, fontSize: 36 }}>
                Configura, testa, usa. Não gostou? <span className="gradient-text">Devolvo tudo.</span>
              </h2>
              <p style={{ marginTop: 20, fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Se em 7 dias você sentir que a Brava não é o que sua empresa precisa, devolvemos 100% do que você pagou. Sem perguntas, sem burocracia, sem aquela conversa de "tem certeza?".
              </p>
              <p style={{ marginTop: 16, fontSize: 15, color: 'var(--text-tertiary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                Prefiro perder uma venda do que ganhar um cliente insatisfeito. É assim que a Brava cresce: com clientes que ficam porque a plataforma entrega, não porque assinaram contrato preso.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 760px) {
            .guarantee-grid { grid-template-columns: 1fr !important; justify-items: center; text-align: center; }
          }
        `}</style>
      </div>
    </section>
  );
}

function Urgency() {
  const [slots] = React.useState({ total: 8, taken: 5 });
  const remaining = slots.total - slots.taken;
  return (
    <section className="section light" id="urgencia">
      <div className="container" style={{ maxWidth: 980 }}>
        <div style={{
          padding: 1.5,
          borderRadius: 24,
          background: 'var(--brava-gradient)'
        }}>
          <div style={{
            background: 'var(--bg-light-card)',
            borderRadius: 23,
            padding: 48,
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 48,
            alignItems: 'center'
          }} className="urg-grid">
            <div>
              <div className="eyebrow"><span className="dot"></span>Capacidade limitada</div>
              <h2 className="h2" style={{ marginTop: 16 }}>
                Atendemos um número limitado de <span className="gradient-text">implementações por mês</span>.
              </h2>
              <p style={{ marginTop: 20, fontSize: 17, color: 'var(--text-on-light-secondary)', lineHeight: 1.55 }}>
                Não é firula de marketing. A Brava entra em cada cliente com configuração guiada: nosso time entende sua operação <em>antes</em> do agente IA começar a responder. Por isso abrimos 8 vagas por mês.
              </p>
              <p style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>
                Hoje ainda tem vaga. Amanhã eu não sei.
              </p>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-on-light-tertiary)', textAlign: 'center', marginBottom: 16 }}>
                Mai/2026 · vagas de implementação
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                marginBottom: 20
              }}>
                {Array.from({ length: slots.total }).map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: '1',
                    borderRadius: 10,
                    background: i < slots.taken
                      ? 'var(--brava-gradient)'
                      : 'transparent',
                    border: i < slots.taken ? 'none' : '1.5px dashed var(--border-light)',
                    display: 'grid', placeItems: 'center',
                    color: i < slots.taken ? '#fff' : 'var(--text-on-light-tertiary)',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 600,
                    fontSize: 18
                  }}>
                    {i < slots.taken
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      : (i + 1)
                    }
                  </div>
                ))}
              </div>
              <div style={{
                padding: 16,
                background: 'linear-gradient(135deg, rgba(123,63,228,0.08), rgba(30,144,255,0.08))',
                border: '1px solid rgba(123,63,228,0.2)',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 36, fontWeight: 700, lineHeight: 1, background: 'var(--brava-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{remaining}</div>
                <div className="mono" style={{ fontSize: 11, marginTop: 4, color: 'var(--text-on-light-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>vagas restantes</div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 820px) {
            .urg-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.Objections = Objections;
window.Guarantee = Guarantee;
window.Urgency = Urgency;
