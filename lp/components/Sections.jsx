/* global React */

function ProposalBlock() {
  const metrics = [
    { num: '+22', label: 'empresas ativas', desc: 'de diferentes segmentos usando a plataforma hoje' },
    { num: '24h', label: 'atendimento com IA', desc: 'sem depender de equipe humana fora do horário comercial' },
    { num: '1',   label: 'plataforma só', desc: 'site, CRM, IA e suporte — sem empilhar ferramentas avulsas' },
  ];

  const pillars = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      title: 'Velocidade de resposta',
      text: 'Agentes de IA respondem em segundos, qualificam o lead e agendam — enquanto sua equipe dorme.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'Operação com seu logo',
      text: 'White-label completo. O cliente vê sua marca, não a nossa. Parece sob medida porque é.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      title: 'Visibilidade total',
      text: 'Pipeline, relatórios e cada conversa em um só lugar. Você sabe exatamente quanto está convertendo.'
    },
  ];

  return (
    <section className="section light" id="proposta">
      <div className="container">

        {/* Label */}
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-on-light-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace', marginBottom: 20 }}>
          Proposta de valor
        </div>

        {/* Headline + copy */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'flex-end', marginBottom: 64 }} className="proposal-top">
          <h2 className="h2" style={{ margin: 0, color: 'var(--text-on-light-primary)' }}>
            O WhatsApp virou a <span className="gradient-text">porta de entrada</span> do seu negócio. E também o maior buraco da sua operação.
          </h2>
          <div>
            <p style={{ margin: '0 0 18px', fontSize: 17, lineHeight: 1.65, color: 'var(--text-on-light-secondary)' }}>
              Mensagem perdida, atendente respondendo do celular pessoal, lead virando fantasma. A cada conversa sem resposta, você perde dinheiro — e nem sabe quanto.
            </p>
            <p style={{ margin: '0 0 28px', fontSize: 17, lineHeight: 1.65, color: 'var(--text-on-light-secondary)' }}>
              A Brava organiza tudo em um único sistema — com seu logo, sua equipe e agentes de IA treinados pra sua operação.
            </p>
            <a href="#planos" className="btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12,
              background: '#1E90FF', color: '#fff',
              fontWeight: 600, fontSize: 15,
              boxShadow: '0 6px 20px rgba(30,144,255,.3)',
              textDecoration: 'none', transition: 'box-shadow .2s, transform .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 10px 28px rgba(30,144,255,.45)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 6px 20px rgba(30,144,255,.3)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              Ver como funciona
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'var(--border-light)', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }} className="proposal-metrics">
          {metrics.map((m, i) => (
            <div key={i} style={{ padding: '32px 28px', background: 'var(--bg-light-card)' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', background: 'var(--brava-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.num}</div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-on-light-primary)', margin: '6px 0 4px' }}>{m.label}</div>
              <div style={{ fontSize: 13.5, color: 'var(--text-on-light-tertiary)', lineHeight: 1.5 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Pilares */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="proposal-pillars">
          {pillars.map((p, i) => (
            <div key={i} style={{
              padding: '28px 24px',
              background: 'var(--bg-light-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 16,
              transition: 'border-color .2s, transform .2s, box-shadow .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(123,63,228,.35)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-light)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(123,63,228,.1),rgba(30,144,255,.1))', border: '1px solid rgba(123,63,228,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B3FE4', marginBottom: 18 }}>{p.icon}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', marginBottom: 10, color: 'var(--text-on-light-primary)' }}>{p.title}</div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text-on-light-secondary)' }}>{p.text}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .proposal-top     { grid-template-columns: 1fr !important; gap: 32px !important; }
          .proposal-metrics { grid-template-columns: 1fr !important; }
          .proposal-pillars { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function PainBlock() {
  const pains = [
    'Cliente manda mensagem de manhã, sua equipe responde só de tarde — quando responde',
    'Atendente atende pelo WhatsApp pessoal e leva todos os contatos quando sai da empresa',
    'Você não tem ideia de quantos leads chegaram esse mês, nem quantos viraram venda',
    'Cada atendente responde de um jeito diferente — alguns vendem, outros espantam',
    'Já tentou outro CRM e a equipe parou de usar depois de 2 semanas',
    'Cliente pergunta sobre serviço, preço, horário — e quem responde é você, no WhatsApp pessoal, às 22h',
    'Sua empresa não tem site, ou tem um site abandonado de 3 anos atrás',
    'Você sabe que precisa "investir em tecnologia" mas não sabe por onde começar nem com quem falar',
  ];
  return (
    <section className="section dark" id="dor">
      <div className="grid-bg" style={{ opacity: 0.5 }}></div>
      <div className="glow-blob purple" style={{ width: 380, height: 380, top: 100, left: '20%', opacity: 0.25 }}></div>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
          <div className="eyebrow"><span className="dot"></span>Reconhece alguma?</div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            Sua operação está deixando <span className="gradient-text">dinheiro na mesa</span>. Todo dia.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {pains.map((p, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              padding: '20px 22px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-dark)',
              borderRadius: 14
            }}>
              <span style={{
                flex: '0 0 auto',
                width: 28, height: 28,
                borderRadius: 999,
                background: 'rgba(255,99,99,0.12)',
                border: '1px solid rgba(255,99,99,0.3)',
                color: '#ff8888',
                display: 'grid', placeItems: 'center',
                fontSize: 14, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace'
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--text-primary)' }}>{p}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 48, fontSize: 17, color: 'var(--text-secondary)' }}>
          Marcou 3 ou mais? Você está sangrando receita silenciosamente. Vamos parar isso.
        </p>
      </div>
    </section>
  );
}

function SolutionBlock() {
  const pillars = [
    {
      icon: '',
      title: 'Site institucional profissional',
      tag: 'PERFORMANCE+',
      copy: 'Construído pela Brava, integrado direto ao CRM. Cada visitante vira lead automaticamente no funil. Não é "site bonito que não converte" — é parte da máquina de vendas.'
    },
    {
      icon: '',
      title: 'Agentes de IA treinados pra sua operação',
      tag: 'CORE',
      copy: 'Vendas, suporte, agendamento e pós-venda — cada um configurado de forma independente pelo seu time. Treinados com seus serviços, horários, objeções e tom de marca.',
      sub: ['Vendas — qualifica lead, tira dúvida de preço, agenda visita', 'Suporte — resolve dúvida de quem já comprou', 'Agendamento — marca horário sem precisar de ninguém', 'Pós-venda — follow-up e reativação de cliente sumido']
    },
    {
      icon: '',
      title: 'CRM completo com seu logo',
      tag: 'WHITE-LABEL',
      copy: 'Inbox, pipeline de vendas, contatos, etiquetas, relatórios. Personalizado com a identidade da sua empresa. Parece sob medida pra você. Porque é.'
    },
    {
      icon: '🛠️',
      title: 'Suporte de gente que entende',
      tag: 'INCLUSO',
      copy: 'Direto dentro do produto. Bug, dúvida, sugestão — você fala com a Brava sem sair da plataforma. SLA visível. Resposta em horas, não em dias.'
    }
  ];

  return (
    <section className="section light" id="solucao">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'flex-start' }} className="solution-grid">
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="eyebrow"><span className="dot"></span>A solução</div>
            <h2 className="h2" style={{ marginTop: 20 }}>
              A Brava é o <span className="gradient-text">setor de tecnologia integrado</span> da sua empresa.
            </h2>
            <p className="lead" style={{ marginTop: 24 }}>
              Não somos mais um CRM genérico. Somos uma agência de tecnologia B2B que age como parte da sua operação — entregando tudo que sua empresa precisa pra crescer no digital, em uma única plataforma, por um único custo mensal.
            </p>
            <div style={{
              marginTop: 32, padding: 24,
              background: 'linear-gradient(135deg, rgba(123,63,228,0.08), rgba(30,144,255,0.08))',
              border: '1px solid rgba(123,63,228,0.2)',
              borderRadius: 16
            }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-on-light-tertiary)' }}>Construída em volta de uma ideia simples</div>
              <div style={{ marginTop: 8, fontSize: 22, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                Sua empresa é única.<br/>A tecnologia dela também precisa ser.
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 18 }}>
            {pillars.map((p, i) => (
              <div key={i} style={{
                background: 'var(--bg-light-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 18,
                padding: 28,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 28, filter: 'grayscale(0.2)' }}>{p.icon}</span>
                    <h3 className="h3">{p.title}</h3>
                  </div>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10, letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'var(--brava-gradient)',
                    color: '#fff',
                    flex: '0 0 auto'
                  }}>{p.tag}</span>
                </div>
                <p style={{ marginTop: 14, marginBottom: 0, color: 'var(--text-on-light-secondary)', fontSize: 16, lineHeight: 1.55 }}>{p.copy}</p>
                {p.sub && (
                  <ul style={{ marginTop: 16, marginBottom: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
                    {p.sub.map((s, j) => (
                      <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-on-light-secondary)' }}>
                        <span style={{ color: '#7B3FE4', fontWeight: 700 }}>→</span> {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .solution-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function BenefitsBlock() {
  const benefits = [
    { t: 'Você dorme tranquilo', d: 'Os agentes de IA respondem cliente às 23h e no domingo, sem você precisar levantar.' },
    { t: 'Sua equipe vira muito mais produtiva', d: 'Atendente para de trocar de tela e responde várias conversas no tempo que respondia uma.' },
    { t: 'Você nunca mais perde lead', d: 'Toda mensagem cai no funil. Ninguém esquece de dar follow-up — o sistema cobra.' },
    { t: 'Você descobre quanto vale cada anúncio', d: 'Sabe de onde veio o cliente, quanto converteu, qual canal dá dinheiro e qual queima.' },
    { t: 'Atendente que sai não leva sua carteira', d: 'Todos os contatos ficam no sistema, com seu logo, na sua empresa.' },
    { t: 'Você atende em padrão grande empresa', d: 'Mesmo sendo PME, o cliente não percebe a diferença.' },
    { t: 'Aumenta ticket médio sem aumentar custo', d: 'Pipeline organizado, upsell fácil, recuperação de carrinho, oferta de outros serviços.' },
    { t: 'Sua marca aparece em cada interação', d: 'Não a marca de uma plataforma terceira. A sua.' },
    { t: 'Economia com fornecedor', d: 'Em vez de pagar agência + CRM + automação + suporte avulso, paga uma assinatura só.' },
    { t: 'Tudo conversa entre si', d: 'Site captura lead → cai no CRM → IA responde → vira venda. Nada de "exportar do A pra importar no B".' },
  ];

  return (
    <section className="section dark" id="beneficios">
      <div className="glow-blob blue" style={{ width: 600, height: 600, top: -200, right: -200, opacity: 0.35 }}></div>
      <div className="glow-blob purple" style={{ width: 500, height: 500, bottom: -200, left: -180, opacity: 0.3 }}></div>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
          <div className="eyebrow"><span className="dot"></span>O que muda na sua operação</div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            10 mudanças concretas <br/>no <span className="gradient-text">primeiro mês</span>.
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 1,
          background: 'var(--border-dark)',
          border: '1px solid var(--border-dark)',
          borderRadius: 18,
          overflow: 'hidden'
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              background: 'var(--bg-elevated)',
              padding: '28px 26px',
              minHeight: 180
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'var(--brava-gradient)',
                  display: 'grid', placeItems: 'center',
                  color: '#fff'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>0{i + 1 < 10 ? i + 1 : ''}{i + 1 >= 10 ? i + 1 : ''}</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{b.t}</h3>
              <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ProposalBlock = ProposalBlock;
window.PainBlock = PainBlock;
window.SolutionBlock = SolutionBlock;
window.BenefitsBlock = BenefitsBlock;
