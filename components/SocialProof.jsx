/* global React */

const ICONS = {
  building: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  health: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z"/><path d="M12 7v6M9 10h6"/></svg>,
  car: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17v-5l2-5h10l2 5v5M5 17v2h2v-2M17 17v2h2v-2"/><circle cx="7.5" cy="14.5" r=".5"/><circle cx="16.5" cy="14.5" r=".5"/></svg>,
  plane: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>,
  leaf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.6.8c0 6.61-1.36 12.59-7.74 14.95"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>,
  sparkle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"/><circle cx="12" cy="12" r="3"/></svg>,
  hammer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9"/><path d="M17.64 15L22 10.64M20.91 11.7l-1.25-1.25a2.16 2.16 0 0 1 0-3L17.66 5.4a2.16 2.16 0 0 0-3 0L13.4 6.66a2.16 2.16 0 0 1-3 0L9.16 5.4"/></svg>,
  bed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16M22 4v16M2 8h20M2 14h20M6 8v6"/></svg>,
  parking: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>,
  factory: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V10l5 3V10l5 3V10l5 3V6l3-2v16z"/><path d="M9 20v-4M14 20v-4"/></svg>,
  cart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>,
};

const SEGMENTS = [
  { name: 'Imobiliário', icon: 'building' },
  { name: 'Saúde', icon: 'health' },
  { name: 'Automotivo', icon: 'car' },
  { name: 'Aviação Civil', icon: 'plane' },
  { name: 'Agro', icon: 'leaf' },
  { name: 'Estética', icon: 'sparkle' },
  { name: 'Construção', icon: 'hammer' },
  { name: 'Turismo', icon: 'bed' },
  { name: 'Estacionamento', icon: 'parking' },
  { name: 'Indústria', icon: 'factory' },
  { name: 'Varejo', icon: 'cart' },
];

const CLIENTS = ['EstacionePark', 'Master Aviação', 'PHS Incorporadora', 'Garcia Sadler', 'Clínica Reunidas', 'Grupo Marinho', 'CasaUrba', 'Hyperplay'];

const TESTIMONIALS = [
  {
    quote: 'Antes a gente perdia mensagem direto, principalmente fim de semana. Hoje todo cliente recebe resposta em segundos, mesmo às 23h. O agente de vendas da Brava virou nosso melhor "atendente" e não tira férias.',
    name: 'Camila Bertolucci',
    role: 'Diretora Comercial',
    company: 'EstacionePark',
    segment: 'Estacionamento',
    metric: 'Volume de leads respondidos'
  },
  {
    quote: 'O que mais mudou foi enxergar o funil. A gente sabia que perdia lead, mas nunca soube quanto. Hoje eu abro o pipeline de manhã e sei exatamente onde estamos. Reunião de comercial saiu de 1h pra 15 minutos.',
    name: 'Rafael Sadler',
    role: 'Sócio-fundador',
    company: 'Garcia Sadler',
    segment: 'Imobiliário',
    metric: 'Visibilidade do pipeline'
  },
  {
    quote: 'A Brava paga a mensalidade no primeiro orçamento aprovado do mês. O resto é margem. Em 2 meses recuperei o investimento. E não tem mais aquela história de atendente saindo e levando contato: agora tudo fica.',
    name: 'Patrícia Marinho',
    role: 'Gestora de Marketing',
    company: 'Grupo Marinho',
    segment: 'Saúde',
    metric: 'Retorno do investimento'
  }
];

function SocialProof() {
  return (
    <section className="section light" id="prova">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 64px' }}>
          <div className="eyebrow"><span className="dot"></span>Prova social</div>
          <h2 className="h2" style={{ marginTop: 20 }}>
            +22 empresas confiam na Brava em <span className="gradient-text">11 segmentos</span> diferentes.
          </h2>
        </div>

        {/* Segments */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
          marginBottom: 56
        }}>
          {SEGMENTS.map((s) => (
            <div key={s.name} style={{
              padding: '10px 18px',
              background: 'var(--bg-light-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 999,
              fontSize: 14, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
              <span style={{ width: 18, height: 18, color: '#1E90FF', display: 'inline-flex' }}>{ICONS[s.icon]}</span>
              {s.name}
            </div>
          ))}
        </div>

        {/* Logos wall */}
        <div style={{
          background: 'var(--bg-light-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 18,
          padding: '28px 24px',
          marginBottom: 64
        }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-on-light-tertiary)', textAlign: 'center', marginBottom: 20 }}>
            Empresas que rodam Brava todos os dias
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px 32px',
            alignItems: 'center'
          }}>
            {CLIENTS.map((c) => (
              <div key={c} style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '-0.01em',
                color: 'var(--text-on-light-tertiary)',
                textAlign: 'center',
                padding: '16px 8px',
                opacity: 0.75
              }}>{c}</div>
            ))}
          </div>
        </div>

        {/* Credibility card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-light-card) 0%, #FAFAFA 100%)',
          border: '1px solid var(--border-light)',
          borderRadius: 20,
          padding: 40,
          marginBottom: 64,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 48,
          alignItems: 'center'
        }} className="cred-card">
          <div>
            <h3 className="h3">Empresa real, com endereço, telefone e nota 5★ no Google.</h3>
            <p style={{ marginTop: 14, color: 'var(--text-on-light-secondary)', fontSize: 16, lineHeight: 1.55 }}>
              A <strong>Brava Company S.A.</strong> é uma agência de tecnologia B2B sediada em <strong>Alphaville, Barueri/SP</strong>, região que concentra as maiores empresas de tecnologia do Brasil. Endereço físico, CNPJ ativo, equipe presencial.
            </p>
            <p style={{ marginTop: 14, color: 'var(--text-on-light-tertiary)', fontSize: 14, fontStyle: 'italic' }}>
              Sem operação fantasma. Sem desaparecer depois da venda. Você liga, a gente atende.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brava-gradient)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-on-light-tertiary)', letterSpacing: '0.08em' }}>EDIFÍCIO ALPHA PREMIUM</div>
                <div style={{ marginTop: 2, fontSize: 15 }}>Al. Rio Negro, 503 · 23º Andar<br/>Alphaville, Barueri/SP</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brava-gradient)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-on-light-tertiary)', letterSpacing: '0.08em' }}>WHATSAPP / TELEFONE</div>
                <div style={{ marginTop: 2, fontSize: 15 }}>(11) 96334-2541</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brava-gradient)', display: 'grid', placeItems: 'center', color: '#fff', flex: '0 0 40px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--text-on-light-tertiary)', letterSpacing: '0.08em' }}>GOOGLE</div>
                <div style={{ marginTop: 2, fontSize: 15 }}>5,0 · perfil verificado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: 24 }}>
          <h3 className="h3" style={{ textAlign: 'center', marginBottom: 36 }}>O que dizem nossos clientes</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20
          }}>
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} style={{
                margin: 0,
                background: 'var(--bg-light-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 18,
                padding: 28,
                display: 'flex', flexDirection: 'column',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.1em',
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'rgba(123,63,228,0.1)',
                  color: '#7B3FE4',
                  border: '1px solid rgba(123,63,228,0.2)'
                }}>EXEMPLO</span>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 48,
                  lineHeight: 0.6,
                  color: '#7B3FE4',
                  opacity: 0.4,
                  marginBottom: 8
                }}>“</span>
                <blockquote style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55, color: 'var(--text-on-light-primary)', flex: 1 }}>
                  {t.quote}
                </blockquote>
                <figcaption style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 999,
                      background: 'var(--brava-gradient)',
                      display: 'grid', placeItems: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 14,
                      fontFamily: 'Inter'
                    }}>{t.name.split(' ').map(s => s[0]).slice(0, 2).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-on-light-tertiary)' }}>{t.role} · {t.company}</div>
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 10, marginTop: 12, color: 'var(--text-on-light-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {t.segment} · foco: {t.metric}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-on-light-tertiary)', fontStyle: 'italic' }}>
            Depoimentos exibidos como exemplo para visualização. Versões finais serão coletadas com clientes reais antes da publicação.
          </p>
        </div>

        <style>{`
          @media (max-width: 820px) {
            .cred-card { grid-template-columns: 1fr !important; gap: 24px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.SocialProof = SocialProof;
