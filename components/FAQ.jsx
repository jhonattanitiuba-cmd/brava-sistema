/* global React, WA_LINK */

const FAQS = [
  { q: 'Quanto tempo leva pra estar rodando?', a: 'Entre 3 e 7 dias úteis. A configuração começa imediatamente após o fechamento, e seu agente IA está respondendo em poucos dias.' },
  { q: 'Funciona pra qualquer tipo de negócio?', a: 'Sim. A plataforma foi construída pra resolver a dor do atendimento, independente da vertical. Hoje atendemos saúde, agro, automotivo, imobiliário, estacionamento, e-commerce, indústria, turismo, construção e outros.' },
  { q: 'E se minha equipe não tem traquejo com tecnologia?', a: 'A interface é parecida com WhatsApp Web. E entregamos o sistema configurado e pronto. Quem usa WhatsApp consegue usar a Brava.' },
  { q: 'Como funciona o suporte?', a: 'Tem uma aba de Suporte direto dentro do sistema. Você abre chamado, sugere melhoria ou tira dúvida e fala diretamente com o time da Brava. Tempo de resposta varia conforme o plano: de 30 minutos (Enterprise) a 1 dia útil (Essencial).' },
  { q: 'Posso usar com mais de um número de WhatsApp?', a: 'Sim. Plano Essencial libera 1 número, Performance libera 2, Scale libera 5, Enterprise libera ilimitado.' },
  { q: 'O site institucional é incluso mesmo? Tem letra miúda?', a: 'Sim, sem letra miúda. Plano Performance pra cima inclui um site profissional construído pelo nosso time, integrado direto ao CRM. Você passa o briefing (logo, cores, conteúdo), a gente entrega no ar. Sem custo extra.' },
  { q: 'Quem é o dono do site? Se eu cancelar, perco?', a: 'O conteúdo (textos, imagens, identidade) é seu. Se cancelar a Brava, te entregamos os arquivos pra você levar pra outro lugar. Você nunca fica refém.' },
  { q: 'E se eu quiser cancelar?', a: 'Pode cancelar quando quiser, sem multa, sem fidelidade. Os primeiros 7 dias têm garantia de devolução total.' },
  { q: 'Aceita Pix?', a: 'Sim. Cartão de crédito, Pix ou boleto. Mensal ou anual (com desconto no anual).' },
  { q: 'Vocês ficam com meus contatos se eu sair?', a: 'Não. Você exporta tudo em CSV a qualquer momento, e quando sai leva todos os dados. Os contatos são seus.' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = React.useState(0);
  return (
    <section className="section light" id="faq">
      <div className="container" style={{ maxWidth: 1040 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 56,
          alignItems: 'flex-start'
        }} className="faq-grid">
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="eyebrow"><span className="dot"></span>FAQ</div>
            <h2 className="h2" style={{ marginTop: 20 }}>
              Perguntas que <span className="gradient-text">a gente mais recebe</span>.
            </h2>
            <p style={{ marginTop: 16, color: 'var(--text-on-light-secondary)', fontSize: 16, lineHeight: 1.55 }}>
              Não achou o que procurava? Manda pra gente no WhatsApp. Respondemos em até 30 minutos no horário comercial.
            </p>
            <a href={WA_LINK} className="btn btn-primary" style={{ marginTop: 24 }}>
              Tirar dúvida no WhatsApp
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <div key={i} style={{
                  background: open ? 'var(--bg-light-card)' : 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'background .2s'
                }}>
                  <button onClick={() => setOpenIdx(open ? -1 : i)} style={{
                    width: '100%',
                    padding: '20px 22px',
                    display: 'flex', justifyContent: 'space-between', gap: 16,
                    alignItems: 'center',
                    textAlign: 'left',
                    color: 'var(--text-on-light-primary)'
                  }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{f.q}</span>
                    <span style={{
                      flex: '0 0 28px',
                      width: 28, height: 28, borderRadius: 999,
                      background: open ? 'var(--brava-gradient)' : 'transparent',
                      border: open ? 'none' : '1px solid var(--border-light)',
                      color: open ? '#fff' : 'var(--text-on-light-tertiary)',
                      display: 'grid', placeItems: 'center',
                      transition: 'transform .2s',
                      transform: open ? 'rotate(45deg)' : 'rotate(0)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                  </button>
                  {open && (
                    <div style={{
                      padding: '0 22px 20px',
                      color: 'var(--text-on-light-secondary)',
                      fontSize: 15.5,
                      lineHeight: 1.6
                    }}>{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <style>{`
          @media (max-width: 880px) {
            .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="section dark" id="cta-final">
      <div className="grid-bg"></div>
      <div className="glow-blob purple" style={{ width: 600, height: 600, top: -100, left: -100, opacity: 0.4 }}></div>
      <div className="glow-blob blue" style={{ width: 600, height: 600, bottom: -100, right: -100, opacity: 0.4 }}></div>
      <div className="container" style={{ maxWidth: 920, textAlign: 'center' }}>
        <div className="eyebrow" style={{ margin: '0 auto' }}><span className="dot"></span>Última chamada</div>
        <h2 className="h1" style={{ marginTop: 24, fontSize: 'clamp(36px, 4.6vw, 64px)' }}>
          Sua próxima venda pode estar te esperando agora. <br/>
          <span className="gradient-text">E ninguém respondeu.</span>
        </h2>
        <p className="lead" style={{ marginTop: 28, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          Cada minuto que sua operação roda no WhatsApp bagunçado é dinheiro escorrendo. Lead que não responderam. Cliente que esqueceu de você. Atendente sobrecarregado que vai pedir demissão semana que vem.
        </p>
        <p className="lead" style={{ marginTop: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          Não precisa continuar assim.
        </p>
        <p style={{ marginTop: 24, color: 'var(--text-secondary)', fontSize: 16, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          A demonstração leva 30 minutos. A gente entende seu negócio, te mostra a plataforma rodando, e você decide se faz sentido. Sem pressão, sem cartão de crédito, sem compromisso.
        </p>
        <div style={{ marginTop: 36, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WA_LINK} className="btn btn-primary" style={{ height: 64, padding: '0 32px', fontSize: 18 }}>
            Quero falar com um especialista
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
        <div className="mono" style={{ marginTop: 18, fontSize: 13, color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
          Resposta em até 30 minutos · WhatsApp direto · Sem formulário
        </div>
      </div>
    </section>
  );
}

function PSFooter() {
  return (
    <section className="section dark" id="ps" style={{ paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <div style={{
          padding: '40px 0 24px',
          borderTop: '1px solid var(--border-dark)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 32,
          alignItems: 'flex-start'
        }} className="ps-grid">
          <div className="mono" style={{
            fontSize: 12, letterSpacing: '0.14em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            paddingTop: 4
          }}>P.S.</div>
          <div>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: 'var(--text-primary)' }}>
              Se você leu até aqui, é porque algo na sua operação está pedindo socorro. A boa notícia é que a solução existe, está pronta, e mais de 22 empresas já estão rodando com ela.
            </p>
            <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              A pergunta não é se sua empresa precisa profissionalizar o atendimento. É <em>quando</em>. Quanto antes, mais rápido você para de perder venda e começa a recuperar o que está deixando na mesa.
            </p>
            <a href={WA_LINK} className="btn btn-primary" style={{ marginTop: 24 }}>
              Falar agora com a Brava
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <div style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: '1px solid var(--border-dark)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'flex-end'
        }} className="ps-grid">
          <div>
            <div className="logo">
              <span className="mark">B</span>
              <span>brava<span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>.crm</span></span>
            </div>
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6, maxWidth: 520 }}>
              Brava Company S.A. · Agência de Tecnologia B2B com IA Integrada<br/>
              Edifício Alpha Premium · Al. Rio Negro, 503 · 23º Andar · Alphaville, Barueri/SP<br/>
              CNPJ ativo · Atendimento que vende, com agentes de IA treinados especificamente pra sua operação.
            </p>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textAlign: 'right' }}>
            © 2026 BRAVA COMPANY<br/>
            v1.5 · LP-PRINCIPAL
          </div>
        </div>
        <style>{`
          @media (max-width: 720px) {
            .ps-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.FAQ = FAQ;
window.FinalCTA = FinalCTA;
window.PSFooter = PSFooter;
