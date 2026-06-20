/* global React, WA_LINK */

const FAQS = [
  { q: 'Quanto tempo leva pra estar rodando?',                       a: 'A configuração começa logo após o fechamento. Em poucas horas seu primeiro agente de IA já está respondendo, e nosso time entra com você para deixar cada setor pronto.' },
  { q: 'Funciona pra qualquer tipo de negócio?',                     a: 'Sim. A plataforma se adapta à sua operação, da imobiliária à clínica, do varejo à indústria. Hoje mais de 18 nichos rodam na Brava.' },
  { q: 'Achei que ia ser caro pro tamanho da minha operação.',       a: 'A pergunta certa não é se cabe no orçamento, é quanto você perde hoje em leads sem resposta, follow-ups esquecidos e horas refeitas. Em muitos clientes a plataforma se paga em um a dois meses. Mostramos essa conta na demonstração.' },
  { q: 'Já tentei outro sistema e meu time não usou. Vai ser diferente?', a: 'Sistemas genéricos são feitos para todo mundo e configurados para ninguém. A Brava entra com configuração guiada: entendemos como sua empresa funciona e entregamos tudo pronto. A interface lembra o WhatsApp Web, então quem usa o celular consegue usar.' },
  { q: 'Já uso o WhatsApp Business. Por que mudar?',                 a: 'O WhatsApp Business resolve o básico. Ele não tem CRM, funil, agentes de IA, financeiro nem a sua marca. A Brava começa onde ele para e conecta o atendimento ao resto da operação.' },
  { q: 'O site institucional é incluso mesmo? De quem ele fica?',    a: 'Do plano Performance pra cima, sim, sem custo extra: nosso time constrói um site profissional integrado ao CRM, e cada visitante vira lead no funil. O conteúdo e a identidade são seus. Se um dia sair, leva tudo.' },
  { q: 'Posso usar mais de um número de WhatsApp?',                  a: 'Pode. Essencial libera 1 número, Performance libera 2, Scale libera 5 e Enterprise libera ilimitado.' },
  { q: 'Como funciona o suporte?',                                   a: 'Tem uma aba de Suporte dentro do sistema: você abre chamado, sugere melhoria ou tira dúvida e fala direto com o time da Brava. O tempo de resposta varia por plano, de 1 dia útil a 30 minutos.' },
  { q: 'E se eu quiser cancelar? Fico preso ou perco meus dados?',   a: 'Sem fidelidade e sem multa: cancela quando quiser. Os primeiros 7 dias têm garantia de devolução total. E os contatos são seus, dá pra exportar tudo a qualquer momento.' },
  { q: 'Quais as formas de pagamento?',                              a: 'Cartão de crédito, Pix ou boleto. Mensal ou anual, com desconto no plano anual.' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <section className="section dark" id="faq">
      <div className="container" style={{ maxWidth:1040 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:56, alignItems:'flex-start' }} className="faq-grid">

          {/* Coluna esquerda sticky */}
          <div style={{ position:'sticky', top:100 }}>
            <div className="eyebrow"><span className="dot"></span>FAQ</div>
            <h2 className="h2" style={{ marginTop:20 }}>
              Perguntas que <span className="gradient-text">a gente mais recebe</span>.
            </h2>
            <p style={{ marginTop:16, color:'var(--text-secondary)', fontSize:16, lineHeight:1.55 }}>
              Não achou o que procurava? Manda pra gente no WhatsApp. Respondemos em até 30 minutos no horário comercial.
            </p>
            <a href={WA_LINK} className="btn btn-primary" style={{ marginTop:24 }}>
              Tirar dúvida no WhatsApp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>

          {/* Acordeão */}
          <div style={{ display:'grid', gap:8 }}>
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={i} style={{
                  background: open ? 'var(--bg-card)' : 'transparent',
                  border: `1px solid ${open ? 'rgba(123,63,228,.3)' : 'var(--border-dark-soft)'}`,
                  borderRadius:14, overflow:'hidden',
                  transition:'background .2s, border-color .2s'
                }}>
                  <button onClick={() => setOpenIdx(open ? -1 : i)} style={{
                    width:'100%', padding:'18px 22px',
                    display:'flex', justifyContent:'space-between', gap:16, alignItems:'center',
                    textAlign:'left', color:'var(--text-primary)'
                  }}>
                    <span style={{ fontFamily:'Inter', fontWeight:600, fontSize:16.5, letterSpacing:'-.01em' }}>{f.q}</span>
                    <span style={{
                      flex:'0 0 28px', width:28, height:28, borderRadius:999,
                      background: open ? 'var(--brava-gradient)' : 'transparent',
                      border: open ? 'none' : '1px solid var(--border-dark-soft)',
                      color: open ? '#fff' : 'var(--text-tertiary)',
                      display:'grid', placeItems:'center',
                      transition:'transform .2s',
                      transform: open ? 'rotate(45deg)' : 'rotate(0)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                  </button>
                  {open && (
                    <div style={{ padding:'0 22px 20px', color:'var(--text-secondary)', fontSize:15.5, lineHeight:1.6 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <style>{`@media (max-width: 880px) { .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }`}</style>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section dark" id="cta-final">
      <div className="grid-bg"></div>
      <div className="glow-blob purple" style={{ width:600, height:600, top:-100, left:-100, opacity:0.38 }}></div>
      <div className="glow-blob blue"   style={{ width:600, height:600, bottom:-100, right:-100, opacity:0.38 }}></div>
      <div className="container" style={{ maxWidth:920, textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'6px 16px', borderRadius:999, background:'#1E90FF', color:'#fff', fontSize:11, fontFamily:'JetBrains Mono, monospace', letterSpacing:'.12em', fontWeight:600, textTransform:'uppercase', boxShadow:'0 4px 14px rgba(30,144,255,.35)', margin:'0 auto' }}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.75)'}}/>
          Vamos conversar
        </div>
        <h2 className="h1" style={{ marginTop:24, fontSize:'clamp(36px,4.6vw,64px)' }}>
          A operação inteira da sua empresa, <br/>
          <span className="gradient-text">num só lugar.</span>
        </h2>
        <p className="lead" style={{ marginTop:28, maxWidth:720, marginLeft:'auto', marginRight:'auto' }}>
          Comercial, financeiro, jurídico, operações e o restante da sua empresa, conectados com engenharia de dados e IA. Mostramos a plataforma funcionando e desenhamos com você o melhor ponto de partida.
        </p>
        <p className="lead" style={{ marginTop:16, fontWeight:600, color:'var(--text-primary)' }}>
          Comece pela conversa, sem compromisso.
        </p>
        <div style={{ marginTop:36, display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a href={WA_LINK} className="btn btn-primary" style={{ height:64, padding:'0 32px', fontSize:18 }}>
            Quero falar com um especialista
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div className="mono" style={{ marginTop:18, fontSize:13, color:'var(--text-tertiary)', letterSpacing:'.04em' }}>
          Resposta em até 30 minutos · WhatsApp direto · Sem formulário
        </div>
      </div>
    </section>
  );
}

function PSFooter() {
  return (
    <section className="section dark" id="ps" style={{ paddingTop:0 }}>
      <div className="container" style={{ maxWidth:920 }}>
        <div style={{
          paddingTop:32, borderTop:'1px solid var(--border-dark)',
          display:'grid', gridTemplateColumns:'1fr auto', gap:24, alignItems:'flex-end'
        }} className="ps-grid">
          <div>
            <div className="logo">
              <span className="mark">B</span>
              <span>brava<span style={{ color:'var(--text-tertiary)', fontWeight:400 }}>.crm</span></span>
            </div>
            <p style={{ marginTop:16, fontSize:13, color:'var(--text-tertiary)', lineHeight:1.6, maxWidth:520 }}>
              Brava Company S.A. · Agência de Tecnologia B2B com IA Integrada<br/>
              Edifício Alpha Premium · Al. Rio Negro, 503 · 23º Andar · Alphaville, Barueri/SP<br/>
              CNPJ ativo · Atendimento que vende, com agentes de IA treinados especificamente pra sua operação.
            </p>
          </div>
          <div className="mono" style={{ fontSize:11, color:'var(--text-tertiary)', letterSpacing:'.08em', textAlign:'right' }}>
            © 2026 BRAVA COMPANY<br/>
            v1.6 · LP-PRINCIPAL
          </div>
        </div>
        <style>{`@media (max-width: 720px) { .ps-grid { grid-template-columns: 1fr !important; gap: 16px !important; } }`}</style>
      </div>
    </section>
  );
}

window.FAQ      = FAQ;
window.FinalCTA = FinalCTA;
window.PSFooter = PSFooter;
