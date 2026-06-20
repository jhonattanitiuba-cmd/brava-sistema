/* global React, FeatureIcon, WA_LINK */
// ═══════════════════════════════════════════════════════════════════
// SECTORS - os setores da plataforma Brava, em ordem intencional.
// ═══════════════════════════════════════════════════════════════════
// Esta é a peça central do reposicionamento: a Brava Software como o
// braço de tecnologia B2B da operação do cliente, reunindo num só lugar
// comercial, administrativo, jurídico, operações, tráfego, marketing,
// financeiro e tecnologia.
//
// SECTORS é a FONTE ÚNICA e ORDENADA reutilizada por:
//   1. esta seção da landing page;
//   2. o tour guiado de onboarding (mesma ordem) no SaaS (window.SECTORS).
//
// Regras de copy: tom elegante e consultivo, nada técnico, sem travessões
// e sem repetição mecânica de artigos.
// ═══════════════════════════════════════════════════════════════════

const SECTORS = [
  {
    id: 'comercial', n: 1, nome: 'Comercial', status: 'disponivel',
    icon: 'pipeline funil', accent: '#1E90FF',
    tag: 'Vender mais, com método',
    desc: 'Agentes de IA organizados por setor, todos conectados ao banco de dados central. WhatsApp, CRM e pipeline trabalham juntos para nenhum lead esfriar.',
    telas: ['WhatsApp + CRM', 'Pipeline de vendas', 'IA de vendas'],
  },
  {
    id: 'administrativo', n: 2, nome: 'Administrativo', status: 'disponivel',
    icon: 'configuração setup', accent: '#1E90FF',
    tag: 'A rotina, organizada',
    desc: 'Uma tela minimalista que resolve o dia a dia: orçamentos e propostas em minutos, atas de reunião automáticas e projetos documentados do briefing ao fim.',
    telas: ['Orçamento e proposta', 'Ata automática', 'Gestão de projetos'],
  },
  {
    id: 'juridico', n: 3, nome: 'Jurídico', status: 'disponivel',
    icon: 'seguro protegido', accent: '#7B3FE4',
    tag: 'Segurança em cada venda',
    desc: 'Contratos padrão por produto ou vertical, emissão integrada e formalizações sem fricção. A venda fechada já nasce protegida.',
    telas: ['Contratos por vertical', 'Emissor integrado', 'Formalizações'],
  },
  {
    id: 'operacoes', n: 4, nome: 'Operações', status: 'disponivel',
    icon: 'equipe', accent: '#1E90FF',
    tag: 'Execução sob controle',
    desc: 'Equipes e projetos, frotas ou loja: indicadores e checkpoints que mostram o andamento real. Completo no essencial, simples de usar.',
    telas: ['Equipes e projetos', 'Indicadores e checkpoints', 'Frotas ou e-commerce'],
  },
  {
    id: 'trafego', n: 5, nome: 'Tráfego', status: 'disponivel',
    icon: 'anúncio origem atribuição', accent: '#7B3FE4',
    tag: 'Demanda qualificada',
    desc: 'Mídia paga conectada ao comercial: cada real investido vira lead rastreável dentro da plataforma. Validado em produção.',
    telas: ['Campanhas', 'Atribuição de origem', 'Leads rastreáveis'],
  },
  {
    id: 'marketing', n: 6, nome: 'Marketing', status: 'breve',
    icon: 'sua marca brand', accent: '#7B3FE4',
    tag: 'Marca e presença',
    desc: 'Marca, conteúdo e presença consistentes que alimentam o topo do funil e dão voz ao seu negócio.',
    telas: ['Conteúdo', 'Presença de marca', 'Calendário'],
  },
  {
    id: 'financeiro', n: 7, nome: 'Financeiro', status: 'disponivel',
    icon: 'custo fornecedor economia', accent: '#1E90FF',
    tag: 'Connect to use, via Open Finance',
    desc: 'Conecte a conta e o financeiro se monta sozinho: conciliação por categoria, fluxo de caixa, projeção e DRE. Boleto, PIX e nota fiscal pela plataforma, com comprovante na sua marca.',
    telas: ['Conciliação e DRE', 'Fluxo de caixa e projeção', 'Boleto, PIX e nota fiscal'],
  },
  {
    id: 'tecnologia', n: 8, nome: 'Tecnologia', status: 'disponivel',
    icon: 'api webhook', accent: '#1E90FF',
    tag: 'A Brava ao seu lado',
    desc: 'Estabilidade, novidades em construção e histórico de atualizações num só lugar. Abra um chamado ou fale com a gente sempre que precisar.',
    telas: ['Estabilidade e roadmap', 'Histórico de atualizações', 'Suporte e contato'],
  },
];

// Sequência do tour guiado de onboarding (mesma ordem dos setores).
// Esqueleto de dados; a lógica de navegação do tour é implementada no SaaS.
const SECTOR_TOUR = SECTORS.map((s, i) => ({
  passo: i + 1,
  id: s.id,
  titulo: s.nome,
  telas: s.telas,
}));

const _STATUS = {
  disponivel: { label: 'Disponível', color: '#1D9E75', bg: 'rgba(29,158,117,.10)', border: 'rgba(29,158,117,.35)' },
  breve:      { label: 'Em breve',  color: '#C9A227', bg: 'rgba(201,162,39,.10)', border: 'rgba(201,162,39,.35)' },
};

function SectorCard({ s }) {
  const st = _STATUS[s.status] || _STATUS.disponivel;
  return (
    <div className="sector-card" style={{
      position: 'relative', display: 'flex', flexDirection: 'column', gap: 14,
      padding: '22px 22px 20px', borderRadius: 16,
      background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
      transition: 'transform .2s, border-color .2s, background .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FeatureIcon text={s.icon} size={18} color={s.accent} />
          <span style={{
            fontSize: 10.5, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.12em',
            color: 'var(--text-tertiary)',
          }}>{String(s.n).padStart(2, '0')}</span>
        </div>
        <span style={{
          fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.08em',
          textTransform: 'uppercase', color: st.color,
          background: st.bg, border: `1px solid ${st.border}`,
          borderRadius: 999, padding: '3px 9px',
        }}>{st.label}</span>
      </div>

      <div>
        <h3 style={{
          fontSize: 18, fontWeight: 600, fontFamily: 'Inter', letterSpacing: '-0.01em',
          color: 'var(--text-primary)', margin: '0 0 4px',
        }}>{s.nome}</h3>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: s.accent }}>{s.tag}</div>
      </div>

      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>
        {s.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 'auto', paddingTop: 6 }}>
        {s.telas.map((t) => (
          <span key={t} style={{
            fontSize: 11, color: 'var(--text-tertiary)',
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)',
            borderRadius: 8, padding: '4px 9px',
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function Sectors() {
  return (
    <section className="section dark" id="setores">
      <div className="glow-blob purple" style={{ width: 460, height: 460, top: -160, left: -120, opacity: 0.22 }}></div>
      <div className="glow-blob blue" style={{ width: 420, height: 420, bottom: -140, right: -140, opacity: 0.20 }}></div>
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Brava Software · Braço de tecnologia B2B</div>
          <h2 className="h2" style={{ marginTop: 18 }}>
            A operação inteira da sua empresa, <span className="gradient-text">num só lugar.</span>
          </h2>
          <p className="sec-sub">
            Uma plataforma que reúne comercial, administrativo, jurídico, operações, tráfego,
            marketing, financeiro e tecnologia, com engenharia de dados e IA. A informação entra
            organizada e segura, a um toque de distância pelo Copilot no WhatsApp, já incluso no plano.
          </p>
        </div>

        <div className="sectors-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 8,
        }}>
          {SECTORS.map((s) => <SectorCard key={s.id} s={s} />)}
        </div>

        <p style={{
          textAlign: 'center', marginTop: 28, fontSize: 13.5, color: 'var(--text-tertiary)',
        }}>
          Você não contrata um software. Ganha um time de tecnologia como parceiro de negócio.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
          <a href="#planos" className="btn btn-primary">
            Ver planos
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a href={WA_LINK} className="btn btn-secondary">Falar com especialista</a>
        </div>
      </div>

      <style>{`
        .sector-card:hover {
          transform: translateY(-3px);
          border-color: rgba(30,144,255,.35) !important;
          background: rgba(30,144,255,.04) !important;
        }
        @media (max-width: 1080px) {
          #setores .sectors-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          #setores .sectors-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.Sectors = Sectors;
window.SECTORS = SECTORS;
window.SECTOR_TOUR = SECTOR_TOUR;
