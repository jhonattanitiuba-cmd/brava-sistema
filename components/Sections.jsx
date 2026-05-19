/* global React, FeatureIcon */

function ProposalBlock() {
  const metrics = [
    { num: '+22', label: 'empresas ativas',     desc: 'de diferentes segmentos usando a plataforma hoje' },
    { num: '24h', label: 'atendimento com IA',  desc: 'sem depender de equipe humana fora do horário comercial' },
    { num: '1',   label: 'plataforma única',    desc: 'site, CRM, IA e suporte sem empilhar ferramentas avulsas' },
  ];

  const pillars = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      title: 'Velocidade de resposta',
      text: 'Agentes de IA respondem em segundos, qualificam o lead e agendam enquanto sua equipe dorme.'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title: 'Operação com seu logo',
      text: 'White-label completo. O cliente vê sua marca, não a nossa. Parece sob medida porque é.'
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      title: 'Visibilidade total',
      text: 'Pipeline, relatórios e cada conversa em um só lugar. Você sabe exatamente quanto está convertendo.'
    },
  ];

  return (
    <section className="section light proposal-section" id="proposta">
      <div className="container">

        {/* Eyebrow elegante com linha + texto */}
        <div className="proposal-eyebrow">
          <span className="proposal-eyebrow__line" />
          <span className="proposal-eyebrow__text">Proposta de valor</span>
        </div>

        {/* Headline + copy lado a lado */}
        <div className="proposal-top">
          <h2 className="h2 proposal-h2">
            O WhatsApp virou a <span className="gradient-text">porta de entrada</span> do seu negócio.
            <span className="proposal-h2__faded"> E também o maior buraco da sua operação.</span>
          </h2>
          <div className="proposal-copy">
            <p className="proposal-copy__p">
              Mensagem perdida, atendente respondendo do celular pessoal, lead virando fantasma. A cada conversa sem resposta, você perde dinheiro. E nem sabe quanto.
            </p>
            <p className="proposal-copy__p">
              A Brava organiza tudo em um único sistema, com seu logo, sua equipe e agentes de IA treinados pra sua operação.
            </p>
            <a href="#planos" className="proposal-cta">
              Ver como funciona
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Metricas — linhas verticais separando, sem caixa pesada */}
        <div className="proposal-metrics">
          {metrics.map((m, i) => (
            <div key={i} className="proposal-metric">
              <div className="proposal-metric__num">{m.num}</div>
              <div className="proposal-metric__label">{m.label}</div>
              <div className="proposal-metric__desc">{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Pilares */}
        <div className="proposal-pillars">
          {pillars.map((p, i) => (
            <div key={i} className="proposal-pillar">
              <div className="proposal-pillar__icon">{p.icon}</div>
              <div className="proposal-pillar__title">{p.title}</div>
              <div className="proposal-pillar__text">{p.text}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .proposal-section { padding: 96px 0 !important; }

        /* Eyebrow refinado */
        .proposal-eyebrow {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 32px;
        }
        .proposal-eyebrow__line {
          display: block; width: 36px; height: 1px;
          background: linear-gradient(90deg, #7B3FE4, #1E90FF);
        }
        .proposal-eyebrow__text {
          font-family: 'Inter', sans-serif;
          font-size: 11.5px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #7B3FE4;
        }

        /* Headline + copy */
        .proposal-top {
          display: grid; grid-template-columns: 1.15fr 1fr;
          gap: 80px; align-items: start;
          margin-bottom: 88px;
        }
        .proposal-h2 {
          margin: 0; color: var(--text-on-light-primary);
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.1; letter-spacing: -0.03em; font-weight: 600;
        }
        .proposal-h2__faded {
          color: var(--text-on-light-secondary); font-weight: 500;
        }
        .proposal-copy { padding-top: 8px; }
        .proposal-copy__p {
          margin: 0 0 18px; font-size: 16px; line-height: 1.7;
          color: var(--text-on-light-secondary); font-family: 'Inter', sans-serif;
        }
        .proposal-cta {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 14px; padding: 13px 22px; border-radius: 999px;
          background: #0A0A0F; color: #fff;
          font-family: 'Inter', sans-serif;
          font-weight: 500; font-size: 14.5px; letter-spacing: -0.005em;
          text-decoration: none;
          border: 1px solid #0A0A0F;
          transition: background .25s ease, border-color .25s ease, transform .15s ease, box-shadow .2s ease;
        }
        .proposal-cta:hover {
          background: #1E90FF; border-color: #1E90FF;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px -8px rgba(30,144,255,.6);
        }
        .proposal-cta svg { transition: transform .25s ease; }
        .proposal-cta:hover svg { transform: translateX(3px); }

        /* ============================================================
           PADRAO DE DESIGN BRAVA - SECAO CLARA
           - Box PEQUENO em fundo branco-gelo: card com accent AZUL
             (fundo branco puro, borda azul sutil, numero/icone azul solido)
           - Box GRANDE de destaque: PRETO com borda fina AZUL
             (igual ao card destacado do bloco Planos)
           ============================================================ */

        /* Metricas (boxes pequenos) - card branco com accent azul */
        .proposal-metrics {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 88px;
        }
        .proposal-metric {
          position: relative;
          padding: 28px 26px 26px;
          background: #FFFFFF;
          border: 1px solid rgba(30,144,255,.18);
          border-radius: 14px;
          transition: border-color .25s ease, transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;
        }
        .proposal-metric::before {
          content: ''; position: absolute; left: 0; top: 18px; bottom: 18px;
          width: 2px; border-radius: 2px;
          background: #1E90FF;
        }
        .proposal-metric:hover {
          border-color: rgba(30,144,255,.45);
          transform: translateY(-2px);
          box-shadow: 0 14px 32px -16px rgba(30,144,255,.35);
        }
        .proposal-metric__num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 38px; font-weight: 600;
          letter-spacing: -0.035em; line-height: 1;
          color: #1E90FF;
        }
        .proposal-metric__label {
          font-family: 'Inter', sans-serif;
          font-weight: 600; font-size: 14.5px;
          color: var(--text-on-light-primary);
          margin: 14px 0 6px;
        }
        .proposal-metric__desc {
          font-family: 'Inter', sans-serif;
          font-size: 13px; line-height: 1.55;
          color: var(--text-on-light-tertiary);
        }

        /* Pilares (boxes grandes) - PRETO com borda fina azul */
        .proposal-pillars {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
        }
        .proposal-pillar {
          padding: 32px 28px;
          background: #0A0A0F;
          border: 1px solid rgba(30,144,255,.35);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: border-color .25s ease, transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;
        }
        .proposal-pillar::after {
          content: ''; position: absolute; inset: 0;
          border-radius: inherit; pointer-events: none;
          background: radial-gradient(120% 80% at 50% -20%, rgba(30,144,255,.10), transparent 60%);
        }
        .proposal-pillar:hover {
          border-color: #1E90FF;
          transform: translateY(-3px);
          box-shadow: 0 18px 40px -14px rgba(30,144,255,.4);
        }
        .proposal-pillar__icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: rgba(30,144,255,.12);
          border: 1px solid rgba(30,144,255,.35);
          display: inline-flex; align-items: center; justify-content: center;
          color: #1E90FF;
          margin-bottom: 20px;
          position: relative; z-index: 1;
          transition: background .25s ease, color .25s ease, border-color .25s ease;
        }
        .proposal-pillar:hover .proposal-pillar__icon {
          background: #1E90FF; color: #fff; border-color: #1E90FF;
        }
        .proposal-pillar__title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600; font-size: 18px; letter-spacing: -0.015em;
          color: #F5F5F7;
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }
        .proposal-pillar__text {
          font-family: 'Inter', sans-serif;
          font-size: 14px; line-height: 1.6;
          color: #A0A0AA;
          position: relative; z-index: 1;
        }

        /* Responsivo */
        @media (max-width: 980px) {
          .proposal-top {
            grid-template-columns: 1fr; gap: 40px; margin-bottom: 64px;
          }
          .proposal-metrics { margin-bottom: 64px; }
          .proposal-pillars { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 720px) {
          .proposal-section { padding: 72px 0 !important; }
          .proposal-metrics { grid-template-columns: 1fr; }
          .proposal-pillars { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

function PainBlock() {
  const pains = [
    'Cliente manda mensagem de manhã, sua equipe responde só de tarde. Quando responde',
    'Atendente atende pelo WhatsApp pessoal e leva todos os contatos quando sai da empresa',
    'Você não tem ideia de quantos leads chegaram esse mês, nem quantos viraram venda',
    'Cada atendente responde de um jeito diferente: alguns vendem, outros espantam',
    'Já tentou outro CRM e a equipe parou de usar depois de 2 semanas',
    'Cliente pergunta sobre serviço, preço, horário, e quem responde é você, no WhatsApp pessoal, às 22h',
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
      copy: 'Construído pela Brava, integrado direto ao CRM. Cada visitante vira lead automaticamente no funil. Não é "site bonito que não converte". É parte da máquina de vendas.'
    },
    {
      icon: '',
      title: 'Agentes de IA treinados pra sua operação',
      tag: 'CORE',
      copy: 'Vendas, suporte, agendamento e pós-venda, cada um configurado de forma independente pelo seu time. Treinados com seus serviços, horários, objeções e tom de marca.',
      sub: ['Vendas: qualifica lead, tira dúvida de preço, agenda visita', 'Suporte: resolve dúvida de quem já comprou', 'Agendamento: marca horário sem precisar de ninguém', 'Pós-venda: follow-up e reativação de cliente sumido']
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
      copy: 'Direto dentro do produto. Bug, dúvida, sugestão: você fala com a Brava sem sair da plataforma. SLA visível. Resposta em horas, não em dias.'
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
              Não somos mais um CRM genérico. Somos uma agência de tecnologia B2B que age como parte da sua operação, entregando tudo que sua empresa precisa pra crescer no digital, em uma única plataforma, por um único custo mensal.
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
    { t: 'Você nunca mais perde lead', d: 'Toda mensagem cai no funil. Ninguém esquece de dar follow-up. O sistema cobra.' },
    { t: 'Você descobre quanto vale cada anúncio', d: 'Sabe de onde veio o cliente, quanto converteu, qual canal dá dinheiro e qual queima.' },
    { t: 'Atendente que sai não leva sua carteira', d: 'Todos os contatos ficam no sistema, com seu logo, na sua empresa.' },
    { t: 'Você atende em padrão grande empresa', d: 'Mesmo sendo PME, o cliente não percebe a diferença.' },
    { t: 'Aumenta ticket médio sem aumentar custo', d: 'Pipeline organizado, upsell fácil, recuperação de carrinho, oferta de outros serviços.' },
    { t: 'Sua marca aparece em cada interação', d: 'Não a marca de uma plataforma terceira. A sua.' },
    { t: 'Economia com fornecedor', d: 'Em vez de pagar agência + CRM + automação + suporte avulso, paga uma assinatura só.' },
    { t: 'Tudo conversa entre si', d: 'Site captura lead → cai no CRM → IA responde → vira venda. Sem "exportar do A pra importar no B".' },
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
              minHeight: 180,
              position: 'relative',
              transition: 'background .25s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.025)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                {/* Icone contextual em tile elegante */}
                <span style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(123,63,228,.18) 0%, rgba(30,144,255,.12) 100%)',
                  border: '1px solid rgba(123,63,228,.25)',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 4px 14px rgba(123,63,228,.10)',
                }}>
                  <FeatureIcon text={b.t} size={16} color="#A78BFA" tile={false} />
                </span>
                {/* Numero do card refinado */}
                <span className="mono" style={{
                  fontSize: 10, color: 'var(--text-tertiary)',
                  letterSpacing: '0.14em', fontWeight: 500,
                  padding: '3px 8px', borderRadius: 999,
                  border: '1px solid rgba(255,255,255,.06)',
                  background: 'rgba(255,255,255,.02)',
                }}>{String(i + 1).padStart(2, '0')} / 10</span>
              </div>
              <h3 style={{
                fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 600,
                margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25,
                color: 'var(--text-primary)',
              }}>{b.t}</h3>
              <p style={{
                margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.55,
                color: 'var(--text-secondary)',
              }}>{b.d}</p>
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
