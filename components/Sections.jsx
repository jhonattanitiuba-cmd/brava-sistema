/* global React, FeatureIcon, WA_LINK */

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function IlluInbox() {
  return (
    <svg viewBox="0 0 560 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="560" height="260" fill="#07070D"/>
      {/* Painel esquerdo: lista de conversas */}
      <rect x="0" y="0" width="196" height="260" fill="#0F0F18"/>
      <rect x="0" y="0" width="196" height="42" fill="#13131E"/>
      <circle cx="22" cy="21" r="8" fill="#7B3FE4" opacity="0.85"/>
      <rect x="37" y="14" width="72" height="7" rx="3.5" fill="#F5F5F7" opacity="0.7"/>
      <rect x="37" y="26" width="48" height="5" rx="2.5" fill="#A0A0AA" opacity="0.4"/>
      <rect x="10" y="48" width="176" height="22" rx="6" fill="#18182A"/>
      <rect x="22" y="56" width="70" height="5" rx="2.5" fill="#6E6E78" opacity="0.45"/>
      {[0,1,2,3,4].map(i => (
        <g key={i} transform={`translate(0,${78+i*37})`}>
          <rect width="196" height="37" fill={i===0 ? "rgba(30,144,255,0.07)" : "transparent"}/>
          {i===0 && <rect width="2" height="37" fill="#1E90FF"/>}
          <circle cx="22" cy="18" r="11" fill={["#25D366","#7B3FE4","#1E90FF","#FF6B35","#FFB800"][i]} opacity="0.75"/>
          <rect x="40" y="9"  width={[65,50,70,52,60][i]} height="6"  rx="3"   fill="#F5F5F7" opacity={i===0?0.9:0.5}/>
          <rect x="40" y="21" width={[90,75,55,80,70][i]} height="5"  rx="2.5" fill="#6E6E78" opacity="0.5"/>
          {i===0 && <rect x="166" y="10" width="22" height="14" rx="7" fill="#25D366"/>}
          {i===0 && <text x="177" y="21" fontSize="8" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="700">2</text>}
          {i!==0 && <text x="180" y="15" fontSize="8" fill="#6E6E78" textAnchor="end" fontFamily="sans-serif">{["14:32","13:01","11:48","10:20"][i-1]}</text>}
        </g>
      ))}
      {/* Painel direito: chat ativo */}
      <rect x="196" y="0" width="364" height="260" fill="#0A0A12"/>
      <rect x="196" y="0" width="364" height="42" fill="#12121A"/>
      <circle cx="218" cy="21" r="10" fill="#25D366" opacity="0.8"/>
      <rect x="234" y="13" width="84" height="7" rx="3.5" fill="#F5F5F7" opacity="0.8"/>
      <circle cx="238" cy="32" r="3" fill="#25D366"/>
      <rect x="246" y="29" width="38" height="5" rx="2.5" fill="#25D366" opacity="0.6"/>
      {/* Badge IA */}
      <rect x="480" y="13" width="68" height="18" rx="9" fill="rgba(123,63,228,0.14)" stroke="rgba(123,63,228,0.35)" strokeWidth="1"/>
      <path d="M490 22 L492 27 L497 29 L492 31 L490 36 L488 31 L483 29 L488 27 Z" fill="#7B3FE4" opacity="0.9"/>
      <text x="506" y="26" fontSize="8.5" fill="#A78BFA" fontFamily="sans-serif" fontWeight="600">IA ativa</text>
      {/* Mensagens */}
      <rect x="206" y="54"  width="188" height="38" rx="10" fill="#1A1A28"/>
      <rect x="216" y="63"  width="140" height="6"  rx="3"   fill="#A0A0AA" opacity="0.55"/>
      <rect x="216" y="75"  width="96"  height="5"  rx="2.5" fill="#A0A0AA" opacity="0.38"/>
      <rect x="206" y="104" width="218" height="48" rx="10" fill="rgba(30,144,255,0.11)" stroke="rgba(30,144,255,0.18)" strokeWidth="1"/>
      <rect x="216" y="113" width="160" height="6"  rx="3"   fill="#7EB8FF" opacity="0.7"/>
      <rect x="216" y="125" width="120" height="5"  rx="2.5" fill="#A0A0AA" opacity="0.45"/>
      <rect x="216" y="136" width="88"  height="5"  rx="2.5" fill="#A0A0AA" opacity="0.32"/>
      <rect x="206" y="164" width="158" height="30" rx="10" fill="#1A1A28"/>
      <rect x="216" y="173" width="110" height="6"  rx="3"   fill="#A0A0AA" opacity="0.5"/>
      {/* Typing area */}
      <rect x="196" y="236" width="364" height="24" fill="#12121A"/>
      <rect x="206" y="242" width="290" height="12" rx="6" fill="#18182A"/>
      <circle cx="546" cy="248" r="9" fill="rgba(30,144,255,0.18)" stroke="rgba(30,144,255,0.4)" strokeWidth="1"/>
    </svg>
  );
}

function IlluPipeline() {
  const cols = [
    { l:'Novos',      c:'#1E90FF', items:[['Ana Paula','Lead quente'],['Pedro Alves','Site']] },
    { l:'Proposta',   c:'#7B3FE4', items:[['Garcia Sadler','R$ 1.400/mês']] },
    { l:'Fechado',    c:'#25D366', items:[['EstacionePark','R$ 1.960/mês'],['Alessandro','R$ 1.100/mês']] },
  ];
  return (
    <svg viewBox="0 0 560 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="560" height="260" fill="#07070D"/>
      <rect y="0" width="560" height="38" fill="#0F0F18"/>
      <rect x="16" y="13" width="72" height="10" rx="5" fill="#F5F5F7" opacity="0.6"/>
      <rect x="100" y="16" width="44" height="6" rx="3" fill="#6E6E78" opacity="0.45"/>
      {cols.map((col, ci) => {
        const x = 10 + ci * 185;
        return (
          <g key={ci}>
            <rect x={x} y="44" width="178" height="210" rx="10" fill="#0F0F18"/>
            <rect x={x} y="44" width="178" height="30" rx="10" fill={col.c} opacity="0.09"/>
            <rect x={x} y="62" width="178" height="12" fill={col.c} opacity="0.09"/>
            <circle cx={x+14} cy={x===10?59:x===195?59:59} r="4" fill={col.c}/>
            <text x={x+24} y="63" fontSize="10" fill={col.c} fontFamily="sans-serif" fontWeight="600">{col.l}</text>
            <rect x={x+136} y="50" width="32" height="16" rx="8" fill={col.c} opacity="0.15"/>
            <text x={x+152} y="62" fontSize="10" fill={col.c} textAnchor="middle" fontFamily="sans-serif" fontWeight="700">{col.items.length}</text>
            {col.items.map((card, ki) => (
              <g key={ki} transform={`translate(${x+10},${82+ki*62})`}>
                <rect width="158" height="52" rx="8" fill="#15151E" stroke="#252535" strokeWidth="1"/>
                <circle cx="14" cy="16" r="5" fill={col.c} opacity="0.5"/>
                <rect x="26" y="11" width={[75,85,60,90][ki*2]} height="6" rx="3" fill="#F5F5F7" opacity="0.7"/>
                <rect x="26" y="23" width={[55,65,45,70][ki*2]} height="5" rx="2.5" fill="#6E6E78" opacity="0.55"/>
                <rect x="10" y="36" width="60" height="9" rx="4.5" fill={col.c} opacity="0.12"/>
                <text x="40" y="44" fontSize="8" fill={col.c} textAnchor="middle" fontFamily="sans-serif">{['WhatsApp','Site','WhatsApp','Indicação'][ki+ci]||'Lead'}</text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function IlluAgent() {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="400" height="280" fill="#07070D"/>
      <defs>
        <radialGradient id="agGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7B3FE4" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#07070D" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="140" rx="180" ry="130" fill="url(#agGlow)"/>
      <circle cx="200" cy="140" r="60" fill="rgba(123,63,228,0.1)"  stroke="rgba(123,63,228,0.22)" strokeWidth="1"/>
      <circle cx="200" cy="140" r="40" fill="rgba(123,63,228,0.16)" stroke="rgba(123,63,228,0.32)" strokeWidth="1"/>
      <path d="M200 118L206 133L222 139L206 145L200 160L194 145L178 139L194 133Z" fill="#A78BFA"/>
      <text x="200" y="170" fontSize="8.5" fill="rgba(167,139,250,0.7)" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1.5">AGENTE IA</text>
      {/* Linhas + nodes */}
      {[
        [140,90,70,75,'Vendas','#1E90FF'],
        [140,140,55,140,'Suporte','#1E90FF'],
        [140,190,70,205,'Agendamento','#1E90FF'],
        [260,90,330,75,'Qualifica','#7B3FE4'],
        [260,140,345,140,'Responde','#7B3FE4'],
        [260,190,330,205,'Follow-up','#7B3FE4'],
      ].map(([x1,y1,nx,ny,label,color],i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={nx+42} y2={ny+14} stroke={color} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 3"/>
          <rect x={nx} y={ny} width="84" height="28" rx="8" fill="#14141E" stroke={color} strokeOpacity="0.28" strokeWidth="1"/>
          <text x={nx+42} y={ny+18} fontSize="9.5" fill="#A0A0AA" textAnchor="middle" fontFamily="sans-serif">{label}</text>
        </g>
      ))}
      {/* 24h badge */}
      <rect x="158" y="50" width="84" height="22" rx="11" fill="rgba(37,211,102,0.1)" stroke="rgba(37,211,102,0.35)" strokeWidth="1"/>
      <circle cx="172" cy="61" r="4" fill="#25D366"/>
      <text x="196" y="65" fontSize="9.5" fill="#25D366" fontFamily="sans-serif" fontWeight="600">24h / 7 dias</text>
    </svg>
  );
}

function IlluAnalytics() {
  const line = [[40,200],[110,175],[180,148],[250,160],[320,115],[390,88],[460,64],[530,45]];
  const d    = line.map((p,i) => `${i===0?'M':'L'}${p[0]} ${p[1]}`).join(' ');
  const fill = [...line,[530,248],[40,248]].map((p,i) => `${i===0?'M':'L'}${p[0]} ${p[1]}`).join(' ')+'Z';
  return (
    <svg viewBox="0 0 570 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="570" height="260" fill="#07070D"/>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#1E90FF" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* KPI cards topo */}
      {[['MRR','+34%','R$ 24.7k',10],['Conversão','+12%','18.4%',200],['Leads','+55%','342',390]].map(([l,g,v,x]) => (
        <g key={l} transform={`translate(${x},6)`}>
          <rect width="168" height="40" rx="8" fill="#0F0F18"/>
          <text x="10" y="17" fontSize="8.5" fill="#6E6E78" fontFamily="sans-serif">{l}</text>
          <text x="10" y="32" fontSize="13"  fill="#F5F5F7" fontFamily="sans-serif" fontWeight="700">{v}</text>
          <rect x="118" y="12" width="40" height="14" rx="7" fill="rgba(37,211,102,0.14)"/>
          <text x="138" y="23" fontSize="9" fill="#25D366" textAnchor="middle" fontFamily="sans-serif">{g}</text>
        </g>
      ))}
      {/* Grid */}
      {[72,114,156,198,240].map(y => <line key={y} x1="40" y1={y} x2="555" y2={y} stroke="#1E1E2A" strokeWidth="1"/>)}
      {/* Y labels */}
      {[['R$ 28k',72],['R$ 21k',114],['R$ 14k',156],['R$ 7k',198]].map(([l,y]) => (
        <text key={l} x="36" y={y+4} fontSize="8" fill="#6E6E78" textAnchor="end" fontFamily="sans-serif">{l}</text>
      ))}
      {/* X labels */}
      {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago'].map((m,i) => (
        <text key={m} x={40+i*70} y={252} fontSize="8" fill="#6E6E78" textAnchor="middle" fontFamily="sans-serif">{m}</text>
      ))}
      {/* Fill + Line */}
      <path d={fill} fill="url(#chartFill)"/>
      <path d={d} stroke="#1E90FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Active point */}
      <circle cx="460" cy="64" r="5"  fill="#1E90FF"/>
      <circle cx="460" cy="64" r="11" fill="rgba(30,144,255,0.18)"/>
      {/* Tooltip */}
      <rect x="464" y="36" width="96" height="38" rx="8" fill="#14141E" stroke="#252535" strokeWidth="1"/>
      <text x="474" y="50" fontSize="8"  fill="#6E6E78" fontFamily="sans-serif">Agosto</text>
      <text x="474" y="64" fontSize="12" fill="#1E90FF" fontFamily="sans-serif" fontWeight="700">R$ 24.700</text>
    </svg>
  );
}

function IlluSite() {
  return (
    <svg viewBox="0 0 560 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
      <rect width="560" height="260" fill="#07070D"/>
      <rect x="28" y="14" width="504" height="238" rx="12" fill="#0F0F18" stroke="#1E1E2A" strokeWidth="1"/>
      {/* Chrome */}
      <rect x="28" y="14" width="504" height="34" rx="12" fill="#141420"/>
      <rect x="28" y="34" width="504" height="14" fill="#141420"/>
      <circle cx="50" cy="31" r="5" fill="#FF6B6B" opacity="0.65"/>
      <circle cx="66" cy="31" r="5" fill="#FFB800" opacity="0.65"/>
      <circle cx="82" cy="31" r="5" fill="#25D366" opacity="0.65"/>
      <rect x="106" y="23" width="300" height="16" rx="8" fill="#0A0A14"/>
      <text x="256" y="35" fontSize="8.5" fill="#6E6E78" textAnchor="middle" fontFamily="sans-serif">suaempresa.com.br</text>
      {/* Favicon dot */}
      <circle cx="115" cy="31" r="3" fill="#7B3FE4" opacity="0.8"/>
      {/* Nav do site */}
      <rect x="28" y="48" width="504" height="30" fill="#12121C"/>
      <rect x="46" y="57" width="44" height="10" rx="5" fill="#7B3FE4" opacity="0.75"/>
      {[104,138,172,210].map((x,i) => (
        <rect key={x} x={x} y="60" width={[28,26,22,30][i]} height="5" rx="2.5" fill="#6E6E78" opacity="0.4"/>
      ))}
      <rect x="444" y="56" width="78" height="16" rx="8" fill="rgba(30,144,255,0.18)" stroke="rgba(30,144,255,0.4)" strokeWidth="1"/>
      <text x="483" y="68" fontSize="8.5" fill="#1E90FF" textAnchor="middle" fontFamily="sans-serif">Falar agora</text>
      {/* Hero */}
      <rect x="28" y="78" width="504" height="106" fill="#09090E"/>
      <rect x="116" y="90"  width="218" height="13" rx="6.5" fill="#F5F5F7" opacity="0.65"/>
      <rect x="130" y="110" width="190" height="9"  rx="4.5" fill="#A0A0AA" opacity="0.35"/>
      <rect x="148" y="126" width="154" height="7"  rx="3.5" fill="#A0A0AA" opacity="0.25"/>
      <rect x="160" y="146" width="120" height="22" rx="11" fill="rgba(30,144,255,0.8)"/>
      <text x="220" y="161" fontSize="9" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="600">Falar com especialista</text>
      {/* Features */}
      <rect x="28" y="184" width="504" height="62" fill="#0C0C18"/>
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${46+i*170},194)`}>
          <rect width="156" height="42" rx="7" fill="#14141E" stroke="#1E1E2A" strokeWidth="1"/>
          <circle cx="16" cy="21" r="9" fill={["#7B3FE4","#1E90FF","#25D366"][i]} opacity="0.45"/>
          <rect x="32" y="12" width={[80,88,68][i]} height="6"  rx="3"   fill="#F5F5F7" opacity="0.5"/>
          <rect x="32" y="24" width={[56,66,48][i]} height="5"  rx="2.5" fill="#6E6E78" opacity="0.4"/>
        </g>
      ))}
    </svg>
  );
}

// ─── Feature Card component (estilo Google AI Plans) ─────────────────────────

function FeatCard({ media, tag, title, desc, wide, accent }) {
  const col = accent || '#1E90FF';
  return (
    <div className={`feat-card${wide ? ' feat-card--wide' : ''}`}>
      <div className="feat-media">{media}</div>
      <div className="feat-body">
        {tag && (
          <span className="feat-tag" style={{ color: col, borderColor: `${col}33` }}>
            {tag}
          </span>
        )}
        <h3 className="feat-title">{title}</h3>
        <p className="feat-desc">{desc}</p>
      </div>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function PainBlock() {
  const pains = [
    { t: 'Resposta que demora', d: 'O cliente manda mensagem e a resposta vem horas depois. Quando chega, ele já comprou de outro.' },
    { t: 'Nada conversa entre si', d: 'Contato no celular de um, planilha com outro, contrato perdido no e-mail. Cada parte da operação vive numa ilha.' },
    { t: 'Nenhum número claro', d: 'Você não sabe quantos leads chegaram, quanto entrou no caixa, nem onde a operação está travando.' },
    { t: 'Cada um faz de um jeito', d: 'Sem processo, cada pessoa atende, orça e cobra do seu jeito. O resultado fica imprevisível.' },
    { t: 'A carteira vai embora junto', d: 'Quando alguém sai da equipe, leva contatos e histórico que deveriam ser da empresa.' },
    { t: 'Não sabe por onde começar', d: 'Você sabe que precisa de tecnologia, mas falta um parceiro que entenda a operação inteira.' },
  ];
  return (
    <section className="section dark" id="dor">
      <div className="grid-bg" style={{ opacity: 0.5 }}></div>
      <div className="glow-blob purple" style={{ width: 380, height: 380, top: 80, left: '18%', opacity: 0.22 }}></div>
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Reconhece alguma?</div>
          <h2 className="h2" style={{ marginTop: 18 }}>
            O que costuma <span className="gradient-text">travar a operação</span> antes de virar venda.
          </h2>
          <p className="sec-sub">Situações comuns no dia a dia. Quantas você reconhece na sua empresa?</p>
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
        <p className="pain-cta-text">Reconheceu três ou mais? É exatamente isso que a plataforma organiza para você.</p>
      </div>
    </section>
  );
}

function SolutionBlock() {
  return (
    <section className="section dark" id="solucao">
      <div className="glow-blob blue"   style={{ width:500, height:500, top:-180, right:-180, opacity:0.28 }}></div>
      <div className="glow-blob purple" style={{ width:400, height:400, bottom:-160, left:-140, opacity:0.22 }}></div>
      <div className="container">
        <div className="sec-header">
          <div className="eyebrow"><span className="dot"></span>Recursos</div>
          <h2 className="h2" style={{ marginTop: 18 }}>
            Os recursos que fazem a operação <span className="gradient-text">girar</span>.
          </h2>
          <p className="sec-sub">Inbox, agente de IA, pipeline, dados, site e suporte. Tudo com a sua marca.</p>
        </div>

        {/* Linha 1: Wide + Narrow */}
        <div className="feat-row feat-row--2-1">
          <FeatCard
            wide
            media={<IlluInbox/>}
            tag="ATENDIMENTO"
            title="Inbox unificado com todas as conversas"
            desc="Toda mensagem do WhatsApp da sua empresa em um só lugar. Nenhum lead some, nenhuma conversa se perde. Sua equipe atende de onde estiver."
            accent="#25D366"
          />
          <FeatCard
            media={<IlluAgent/>}
            tag="INTELIGÊNCIA ARTIFICIAL"
            title="Agente de IA respondendo 24h"
            desc="Qualifica lead, tira dúvida de preço, agenda visita e faz follow-up. Trabalha enquanto sua equipe descansa."
            accent="#7B3FE4"
          />
        </div>

        {/* Linha 2: Narrow + Wide */}
        <div className="feat-row feat-row--1-2" style={{ marginTop: 16 }}>
          <FeatCard
            media={<IlluPipeline/>}
            tag="VENDAS"
            title="Pipeline kanban do lead ao fechamento"
            desc="Visualize cada oportunidade. Cobre, negocie e feche sem sair da plataforma."
            accent="#1E90FF"
          />
          <FeatCard
            wide
            media={<IlluAnalytics/>}
            tag="DADOS"
            title="Você sabe exatamente quanto está convertendo"
            desc="MRR, taxa de conversão, origem de lead, ticket médio, tempo de resposta. Tudo em tempo real, sem exportar planilha."
            accent="#1E90FF"
          />
        </div>

        {/* Linha 3: 3 iguais */}
        <div className="feat-row feat-row--3" style={{ marginTop: 16 }}>
          <FeatCard
            media={<IlluSite/>}
            tag="PERFORMANCE+"
            title="Site incluso no plano"
            desc="Integrado ao CRM. Cada visitante vira lead no funil automaticamente."
            accent="#7B3FE4"
          />
          <FeatCard
            media={
              <div className="feat-media-icon-only" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(30,144,255,0.14) 0%, transparent 70%)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1E90FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <div style={{ marginTop: 16, fontSize: 13, color: '#1E90FF', fontWeight: 600, opacity: 0.8 }}>White-label completo</div>
                <div style={{ marginTop: 6, fontSize: 11, color: '#6E6E78' }}>Logo, cores e domínio próprios</div>
              </div>
            }
            tag="WHITE-LABEL"
            title="Sua marca em cada interação"
            desc="O cliente vê sua empresa, não a nossa. Subdomínio próprio, logo e paleta configurados por você."
            accent="#1E90FF"
          />
          <FeatCard
            media={
              <div className="feat-media-icon-only" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(123,63,228,0.14) 0%, transparent 70%)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div style={{ marginTop: 16, fontSize: 13, color: '#7B3FE4', fontWeight: 600, opacity: 0.85 }}>SLA garantido em contrato</div>
                <div style={{ marginTop: 6, fontSize: 11, color: '#6E6E78' }}>Suporte direto dentro do produto</div>
              </div>
            }
            tag="SUPORTE"
            title="Suporte de gente que entende o seu negócio"
            desc="Bug, dúvida ou ajuste: você fala com a Brava direto dentro da plataforma. SLA visível, sem abrir ticket genérico."
            accent="#7B3FE4"
          />
        </div>

        {/* Encerramento da seção */}
        <div style={{ textAlign:'center', marginTop:64 }}>
          <p style={{ color:'var(--text-secondary)', fontSize:16, marginBottom:20 }}>
            Tudo isso já está pronto. Só falta configurar para a sua empresa.
          </p>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <a href="#planos" className="btn btn-primary">
              Ver planos
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.PainBlock = PainBlock;
window.SolutionBlock = SolutionBlock;
