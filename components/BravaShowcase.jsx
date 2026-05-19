/* global React, WA_LINK */
// ═══════════════════════════════════════════════════════════════════
// BRAVA SHOWCASE — 9 sections novas (estilo Kiwify, identidade Brava)
// ═══════════════════════════════════════════════════════════════════
// Identidade visual:
//   - Background: #0A0A0F (preto profundo)
//   - Gradient marca: linear-gradient(90deg,#7B3FE4,#1E90FF)
//   - Glow blobs: roxo (#7B3FE4) + azul (#1E90FF) com opacity baixa
//   - Cards: rgba(255,255,255,.03) bg + rgba(255,255,255,.06) border
// ═══════════════════════════════════════════════════════════════════

const _BG       = '#0A0A0F';
const _CARD_BG  = 'rgba(255,255,255,.03)';
const _BORDER   = 'rgba(255,255,255,.08)';
const _TEXT1    = '#F5F5F7';
const _TEXT2    = 'rgba(255,255,255,.70)';
const _TEXT3    = 'rgba(255,255,255,.45)';
const _GRAD     = 'linear-gradient(90deg,#7B3FE4 0%,#1E90FF 100%)';
const _GRAD_TEXT = { background: _GRAD, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' };

// ─────────────────────────────────────────────────────────────────────
// 1. TYPOGRAPHY STATEMENT — claim grande + 3 metrics em destaque
// ─────────────────────────────────────────────────────────────────────
function TypographyStatement() {
  return (
    <section className="reveal" style={{
      background:_BG, padding:'120px 24px 80px', borderTop:`1px solid ${_BORDER}`,
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'-200px', left:'-200px', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(123,63,228,.12) 0%, transparent 70%)' }}/>
      <div style={{ position:'absolute', bottom:'-200px', right:'-200px', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(30,144,255,.12) 0%, transparent 70%)' }}/>
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
        <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:24 }}>
          ◇ Atendimento de outro patamar
        </div>
        <h2 style={{
          fontFamily:'Space Grotesk, sans-serif',
          fontSize:'clamp(56px,10vw,160px)', fontWeight:300, letterSpacing:'-.04em',
          lineHeight:.95, color:_TEXT1, marginBottom:40,
        }}>
          Brava <span style={_GRAD_TEXT}>Software.</span>
        </h2>
        <p style={{ fontSize:'clamp(18px,2vw,22px)', color:_TEXT2, maxWidth:680, lineHeight:1.5, marginBottom:64 }}>
          Plataforma que une WhatsApp, agentes de IA e CRM num só lugar.
          Operada por quem entende de venda e desenhada por quem entende de tecnologia.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
          {[
            { num:'+60', label:'clientes ativos' },
            { num:'R$ 692k', label:'em propostas geridas em 2025' },
            { num:'24/7', label:'agentes que nunca dormem' },
          ].map((m,i) => (
            <div key={i} style={{
              padding:'28px 24px', background:_CARD_BG, border:`1px solid ${_BORDER}`,
              borderRadius:18, backdropFilter:'blur(10px)',
            }}>
              <div style={{ fontFamily:'Space Grotesk', fontSize:48, fontWeight:600, letterSpacing:'-.02em', ...(_GRAD_TEXT) }}>{m.num}</div>
              <div style={{ fontSize:14, color:_TEXT3, marginTop:6 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 2. MOCKUP MACBOOK — print do admin flutuando com glow
// ─────────────────────────────────────────────────────────────────────
function MockupMacBook() {
  return (
    <section className="reveal" style={{
      background:_BG, padding:'80px 24px 120px', position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'80%', height:600, background:'radial-gradient(ellipse, rgba(123,63,228,.20) 0%, rgba(30,144,255,.10) 40%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{
            fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,56px)', fontWeight:600,
            letterSpacing:'-.02em', color:_TEXT1, marginBottom:16, lineHeight:1.1,
          }}>
            Tudo numa única tela.<br/>
            <span style={_GRAD_TEXT}>Do primeiro contato à venda fechada.</span>
          </h2>
        </div>

        {/* Mockup MacBook em CSS puro */}
        <div style={{ position:'relative', maxWidth:980, margin:'0 auto' }}>
          {/* Tela */}
          <div style={{
            background:'#000', borderRadius:'14px 14px 4px 4px',
            border:'1px solid #2A2A3A', padding:8, paddingBottom:6,
            boxShadow:'0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04)',
          }}>
            <div style={{
              background:'#0A0A0F', borderRadius:'8px 8px 2px 2px',
              aspectRatio:'16/10', overflow:'hidden', position:'relative',
            }}>
              {/* Header WhatsApp-style */}
              <div style={{ height:36, background:'#111B21', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', padding:'0 14px', gap:8 }}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:'#25D366' }}/>
                <span style={{ fontSize:11, color:'#fff', fontFamily:'Inter', fontWeight:600 }}>WhatsApp Brava</span>
                <span style={{ fontSize:10, color:'rgba(255,255,255,.4)' }}>+55 11 96334-2541</span>
              </div>
              {/* Layout: sidebar | chat list | conversation */}
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 1.5fr', height:'calc(100% - 36px)' }}>
                {/* Sidebar */}
                <div style={{ background:'#000', borderRight:'1px solid rgba(255,255,255,.05)', padding:'14px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
                  {['MessageCircle','KanbanSquare','BarChart3','Users','Settings'].map((_,i) => (
                    <div key={i} style={{ width:32, height:32, borderRadius:8, background: i===0 ? 'rgba(123,63,228,.15)' : 'transparent', border: i===0 ? '1px solid rgba(123,63,228,.3)' : 'none' }}/>
                  ))}
                </div>
                {/* Chat list */}
                <div style={{ background:'#111B21', borderRight:'1px solid rgba(255,255,255,.05)' }}>
                  {['Maria Silva','+55 11 99...','Granlote ✓','RGL Solut.','Aidar Cli.','Const. Soroc.'].map((nome,i) => (
                    <div key={i} style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,.03)', display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background: `hsl(${i*60},60%,45%)`, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11, color:'#fff', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{nome}</div>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,.4)' }}>{i===0 ? 'Bom dia! Posso ajudar?' : '...'}</div>
                      </div>
                      {i<2 && <div style={{ width:16, height:16, borderRadius:'50%', background:'#25D366', fontSize:9, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{i+1}</div>}
                    </div>
                  ))}
                </div>
                {/* Conversation */}
                <div style={{ background:'#0B141A', display:'flex', flexDirection:'column' }}>
                  <div style={{ padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,.05)', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'hsl(0,60%,45%)' }}/>
                    <div>
                      <div style={{ fontSize:11, color:'#fff', fontWeight:600 }}>Maria Silva</div>
                      <div style={{ fontSize:9, color:'#25D366' }}>● online</div>
                    </div>
                  </div>
                  <div style={{ flex:1, padding:14, display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ alignSelf:'flex-start', background:'#1F2C33', padding:'8px 12px', borderRadius:10, fontSize:10, color:'#fff', maxWidth:'70%' }}>Quanto custa o plano?</div>
                    <div style={{ alignSelf:'flex-end', background:'#005C4B', padding:'8px 12px', borderRadius:10, fontSize:10, color:'#fff', maxWidth:'70%' }}>
                      <div style={{ fontSize:7, color:'#7B3FE4', marginBottom:2 }}>IA · Brava</div>
                      Te passo certinho. Pra eu indicar o plano que faz sentido: quantas pessoas atendem no WhatsApp hoje?
                    </div>
                    <div style={{ alignSelf:'flex-start', background:'#1F2C33', padding:'8px 12px', borderRadius:10, fontSize:10, color:'#fff', maxWidth:'70%' }}>Somos 3 atendentes</div>
                    <div style={{ alignSelf:'flex-end', background:'#005C4B', padding:'8px 12px', borderRadius:10, fontSize:10, color:'#fff', maxWidth:'70%' }}>
                      <div style={{ fontSize:7, color:'#7B3FE4', marginBottom:2 }}>IA · Brava</div>
                      O Performance combina. R$ 1.990/mês, 2 números, IA + site institucional.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Base do MacBook */}
          <div style={{
            background:'linear-gradient(180deg,#2A2A3A 0%,#1A1A24 100%)',
            height:14, borderRadius:'0 0 16px 16px', margin:'0 -6px',
            position:'relative',
          }}>
            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:90, height:4, background:'#0F0F18', borderRadius:'0 0 8px 8px' }}/>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 3. SPLIT MOCKUP — iPhone (cliente) + MacBook (operador)
// ─────────────────────────────────────────────────────────────────────
function MockupSplit() {
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}`, position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>◇ Dois lados, uma operação</div>
          <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,52px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1, marginBottom:14 }}>
            O cliente vê o <span style={_GRAD_TEXT}>WhatsApp dele.</span><br/>
            Sua equipe vê <span style={_GRAD_TEXT}>tudo organizado.</span>
          </h2>
          <p style={{ fontSize:18, color:_TEXT2, maxWidth:600, margin:'0 auto', lineHeight:1.5 }}>
            Conversa flui natural pro contato. Pra você, virou pipeline, atribuição, métricas e IA respondendo no automático.
          </p>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
          {/* iPhone mockup */}
          <div style={{
            width:240, height:480, background:'#000', borderRadius:38,
            border:'8px solid #1A1A24', padding:8, position:'relative',
            boxShadow:'0 30px 70px rgba(0,0,0,.5), 0 0 60px rgba(123,63,228,.15)',
          }}>
            {/* Notch */}
            <div style={{ position:'absolute', top:14, left:'50%', transform:'translateX(-50%)', width:90, height:22, background:'#000', borderRadius:14, zIndex:2 }}/>
            {/* Tela WhatsApp do contato */}
            <div style={{ background:'#0B141A', borderRadius:30, height:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}>
              {/* Header verde WhatsApp */}
              <div style={{ background:'#008069', padding:'32px 14px 12px', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:_GRAD }}/>
                <div>
                  <div style={{ fontSize:12, color:'#fff', fontWeight:600 }}>Brava Company</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,.7)' }}>online</div>
                </div>
              </div>
              {/* Msgs */}
              <div style={{ flex:1, padding:12, display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ alignSelf:'flex-end', background:'#005C4B', padding:'7px 10px', borderRadius:'10px 10px 2px 10px', fontSize:10, color:'#fff', maxWidth:'80%' }}>Oi, vi vocês no Insta. Como funciona?</div>
                <div style={{ alignSelf:'flex-start', background:'#1F2C33', padding:'7px 10px', borderRadius:'10px 10px 10px 2px', fontSize:10, color:'#fff', maxWidth:'80%' }}>
                  Oi! Que bom te ver por aqui.
                </div>
                <div style={{ alignSelf:'flex-start', background:'#1F2C33', padding:'7px 10px', borderRadius:'10px 10px 10px 2px', fontSize:10, color:'#fff', maxWidth:'80%' }}>
                  Me conta: tá buscando organizar o atendimento da empresa ou já usa algo e quer trocar?
                </div>
                <div style={{ alignSelf:'flex-end', background:'#005C4B', padding:'7px 10px', borderRadius:'10px 10px 2px 10px', fontSize:10, color:'#fff', maxWidth:'80%' }}>Quero organizar tudo. Quantas pessoas vão usar?</div>
              </div>
              {/* Input WhatsApp */}
              <div style={{ background:'#1F2C33', padding:8, display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ flex:1, height:24, background:'#0B141A', borderRadius:12 }}/>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'#008069' }}/>
              </div>
            </div>
          </div>

          {/* MacBook simplificado mostrando a outra ponta */}
          <div style={{ flex:1, minWidth:360, maxWidth:640 }}>
            <div style={{
              background:'#000', borderRadius:'10px 10px 2px 2px', border:'1px solid #2A2A3A', padding:6,
              boxShadow:'0 30px 70px rgba(0,0,0,.5), 0 0 60px rgba(30,144,255,.12)',
            }}>
              <div style={{ background:'#0A0A0F', borderRadius:'6px 6px 0 0', aspectRatio:'16/10', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {/* Header admin */}
                <div style={{ height:34, background:'#000', borderBottom:'1px solid rgba(255,255,255,.05)', padding:'0 12px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ display:'flex', gap:5 }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:'#FF5F57' }}/>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:'#FFBD2E' }}/>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:'#28C840' }}/>
                  </div>
                  <span style={{ fontSize:10, color:_TEXT3 }}>brava.software/admin</span>
                </div>
                {/* Stats row */}
                <div style={{ padding:14, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                  {[
                    { l:'MRR', v:'R$ 5.4k', c:'#1D9E75' },
                    { l:'Conversas hoje', v:'47', c:'#7B3FE4' },
                    { l:'IA respondeu', v:'89%', c:'#1E90FF' },
                    { l:'Tempo médio', v:'42s', c:'#F5A623' },
                  ].map((s,i)=>(
                    <div key={i} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.05)', borderRadius:6, padding:8 }}>
                      <div style={{ fontSize:8, color:_TEXT3, textTransform:'uppercase', letterSpacing:'.05em' }}>{s.l}</div>
                      <div style={{ fontSize:16, color:s.c, fontWeight:700, fontFamily:'Space Grotesk' }}>{s.v}</div>
                    </div>
                  ))}
                </div>
                {/* Pipeline mini */}
                <div style={{ flex:1, padding:'0 14px 14px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                  {['Lead','Proposta','Negociação','Fechado'].map((col,i)=>(
                    <div key={i} style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.04)', borderRadius:4, padding:6, display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ fontSize:7, color:_TEXT3, textTransform:'uppercase' }}>{col}</div>
                      {[0,1,2].map(j=>(
                        <div key={j} style={{ background:'rgba(255,255,255,.04)', borderRadius:3, height:16, position:'relative' }}>
                          <div style={{ position:'absolute', left:3, top:3, width:6, height:6, borderRadius:'50%', background:_GRAD }}/>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 4. BENEFITS EXCLUSIVE — 3 cards com border gradient
// ─────────────────────────────────────────────────────────────────────
function BenefitsExclusive() {
  const benefits = [
    {
      tag:'01',
      title:'IA que aprende sua operação',
      desc:'Treine o agente com o tom da sua marca, suas regras, seu FAQ. Quando não souber, escala pra humano. Sem alucinação, sem improviso.',
      metric:'89% das mensagens respondidas sem humano',
    },
    {
      tag:'02',
      title:'Múltiplos WhatsApps, uma única tela',
      desc:'Comercial, suporte, financeiro — todos os números da empresa orquestrados. Atendente vê só o que pode, IA roda no que precisa.',
      metric:'+22 instâncias geridas em paralelo',
    },
    {
      tag:'03',
      title:'Setup em 5 minutos, sem desenvolvedor',
      desc:'Escaneia QR, cola o prompt, convida o time. Pronto. Sem código, sem servidor, sem configuração de infraestrutura.',
      metric:'< 5 min do signup ao primeiro atendimento',
    },
  ];
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>◇ Diferenciais</div>
          <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,52px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1 }}>
            3 coisas que só a <span style={_GRAD_TEXT}>Brava entrega.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
          {benefits.map((b,i)=>(
            <div key={i} style={{
              position:'relative', padding:'40px 28px', borderRadius:20,
              background:_CARD_BG, border:`1px solid ${_BORDER}`,
              backdropFilter:'blur(10px)',
              transition:'transform .3s, border-color .3s',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(123,63,228,.4)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=_BORDER; }}
            >
              <div style={{ fontFamily:'Space Grotesk', fontSize:48, fontWeight:300, ...(_GRAD_TEXT), letterSpacing:'-.02em', lineHeight:1, marginBottom:24 }}>{b.tag}</div>
              <h3 style={{ fontFamily:'Space Grotesk', fontSize:22, color:_TEXT1, fontWeight:600, letterSpacing:'-.01em', marginBottom:12 }}>{b.title}</h3>
              <p style={{ fontSize:14, color:_TEXT2, lineHeight:1.55, marginBottom:24 }}>{b.desc}</p>
              <div style={{ paddingTop:18, borderTop:`1px solid ${_BORDER}`, fontSize:12, color:_TEXT3, fontFamily:'JetBrains Mono', letterSpacing:'.02em' }}>{b.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 5. TESTIMONIALS — depoimentos com foto/avatar
// ─────────────────────────────────────────────────────────────────────
function Testimonials() {
  const items = [
    { nome:'Karina Lima',  empresa:'Granlote', cargo:'Diretora Comercial', quote:'A IA respondeu 1.200 mensagens no primeiro mês. Antes eu perdia metade dos leads.', cor:'#7B3FE4' },
    { nome:'Elza Aidar',   empresa:'Clínica Aidar', cargo:'Fundadora', quote:'Sai do WhatsApp pessoal misturado com cliente. Hoje minha equipe vê tudo organizado.', cor:'#1E90FF' },
    { nome:'Valcir Moreira', empresa:'VGR Engenharia', cargo:'Sócio', quote:'Em 7 dias estava rodando. A Brava entendeu nossa operação e ajustou o agente sem dor de cabeça.', cor:'#1D9E75' },
    { nome:'Renan Wilson',  empresa:'TAKET',    cargo:'CEO',  quote:'Foi a primeira plataforma que conseguiu integrar audiovisual com vendas no WhatsApp.', cor:'#BA7517' },
    { nome:'Daniel Itiuba', empresa:'Hiper Play', cargo:'Sócio', quote:'Não precisei contratar mais ninguém. A IA fez o trabalho de 2 atendentes.', cor:'#A32D2D' },
    { nome:'Tifany Sousa',  empresa:'Master Aviação', cargo:'Coordenadora', quote:'O time dorme tranquilo sabendo que a IA cobre o plantão. E o cliente nem percebe.', cor:'#E91E63' },
  ];
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>◇ Quem já confia</div>
          <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,52px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1 }}>
            +60 empresas <span style={_GRAD_TEXT}>já operam pela Brava.</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:18 }}>
          {items.map((it,i)=>(
            <div key={i} style={{
              padding:'28px 26px', background:_CARD_BG, border:`1px solid ${_BORDER}`,
              borderRadius:16, backdropFilter:'blur(10px)', display:'flex', flexDirection:'column', gap:18,
            }}>
              <p style={{ fontSize:16, color:_TEXT1, lineHeight:1.5, margin:0, fontFamily:'Space Grotesk', fontWeight:400 }}>
                <span style={{ color:'#7B3FE4', fontSize:30, lineHeight:0 }}>"</span>
                {it.quote}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:14, borderTop:`1px solid ${_BORDER}` }}>
                <div style={{
                  width:44, height:44, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${it.cor} 0%, #1E90FF 100%)`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontFamily:'Space Grotesk', fontWeight:700, fontSize:16,
                }}>{it.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div>
                  <div style={{ fontSize:14, color:_TEXT1, fontWeight:600 }}>{it.nome}</div>
                  <div style={{ fontSize:12, color:_TEXT3 }}>{it.cargo} · <span style={{ color:_TEXT2 }}>{it.empresa}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 6. CASE STUDY — caso destacado com métricas
// ─────────────────────────────────────────────────────────────────────
function CaseStudy() {
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'30%', left:'-100px', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(123,63,228,.15) 0%, transparent 70%)' }}/>
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }} className="cs-grid">
          <div>
            <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:18 }}>◇ Case · Granlote</div>
            <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,48px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1, marginBottom:24 }}>
              19 briefings/mês,<br/>
              <span style={_GRAD_TEXT}>0 mensagens perdidas.</span>
            </h2>
            <p style={{ fontSize:17, color:_TEXT2, lineHeight:1.5, marginBottom:32 }}>
              Construtora de Sorocaba que opera 24/7 sem call center. A IA da Brava qualifica leads,
              envia portfolio, marca visita técnica e só passa pro time quando o cliente está pronto.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:32 }}>
              {[
                { v:'19', l:'briefings/mês' },
                { v:'<1min', l:'tempo médio resposta' },
                { v:'72%', l:'leads qualificados pela IA' },
              ].map((m,i)=>(
                <div key={i}>
                  <div style={{ fontFamily:'Space Grotesk', fontSize:32, fontWeight:600, ...(_GRAD_TEXT), letterSpacing:'-.02em', lineHeight:1 }}>{m.v}</div>
                  <div style={{ fontSize:12, color:_TEXT3, marginTop:4 }}>{m.l}</div>
                </div>
              ))}
            </div>
            <a href={WA_LINK} style={{
              display:'inline-flex', alignItems:'center', gap:8, color:'#1E90FF',
              fontSize:14, fontWeight:600, textDecoration:'none', borderBottom:'1px solid rgba(30,144,255,.3)', paddingBottom:4,
            }}>
              Ver case completo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{
            aspectRatio:'4/3', borderRadius:20, overflow:'hidden',
            background:'linear-gradient(135deg,rgba(123,63,228,.15) 0%,rgba(30,144,255,.10) 100%)',
            border:`1px solid ${_BORDER}`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {/* Placeholder visual: building geometric */}
            <svg width="60%" height="60%" viewBox="0 0 200 200" fill="none">
              <rect x="40" y="60" width="40" height="120" fill="rgba(255,255,255,.05)" stroke="rgba(123,63,228,.4)" strokeWidth="1"/>
              <rect x="85" y="30" width="40" height="150" fill="rgba(255,255,255,.05)" stroke="rgba(30,144,255,.4)" strokeWidth="1"/>
              <rect x="130" y="80" width="40" height="100" fill="rgba(255,255,255,.05)" stroke="rgba(123,63,228,.4)" strokeWidth="1"/>
              {[...Array(20)].map((_,i)=>{
                const cols=[40,85,130][i%3]; const offsets=[50,40,90][i%3];
                return <rect key={i} x={cols+5} y={offsets+10+Math.floor(i/3)*18} width="10" height="8" fill="rgba(30,144,255,.3)"/>
              })}
            </svg>
            <div style={{ position:'absolute', bottom:24, left:24, padding:'10px 16px', background:'rgba(0,0,0,.6)', backdropFilter:'blur(10px)', borderRadius:10, border:`1px solid ${_BORDER}` }}>
              <div style={{ fontSize:11, color:_TEXT3, fontFamily:'JetBrains Mono' }}>◇ CONSTRUÇÃO CIVIL</div>
              <div style={{ fontSize:14, color:_TEXT1, fontWeight:600, marginTop:2 }}>Granlote — Sorocaba/SP</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .cs-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 7. SUPPORT CARD — atendimento 1 min (estilo Stripe)
// ─────────────────────────────────────────────────────────────────────
function SupportCard() {
  return (
    <section className="reveal" style={{ background:_BG, padding:'40px 24px 120px' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{
          padding:'56px 48px', borderRadius:24,
          background:'linear-gradient(135deg,#0F0F18 0%,#15151F 100%)',
          border:`1px solid ${_BORDER}`, position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, right:0, width:400, height:400, background:'radial-gradient(circle, rgba(30,144,255,.10) 0%, transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:48, alignItems:'center', position:'relative' }} className="cs-grid">
            <div>
              <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>◇ Atendimento real</div>
              <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(28px,3.5vw,44px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1, marginBottom:18 }}>
                Suporte humano em <span style={_GRAD_TEXT}>menos de 1 minuto.</span>
              </h2>
              <p style={{ fontSize:17, color:_TEXT2, lineHeight:1.5, marginBottom:24 }}>
                7 dias por semana, sem ticket, sem chatbot genérico. Você fala direto com alguém da Brava no WhatsApp — quem te respondeu também resolve.
              </p>
              <a href={WA_LINK} style={{
                display:'inline-flex', alignItems:'center', gap:10, padding:'14px 24px',
                background:_GRAD, color:'#fff', borderRadius:12, fontSize:15, fontWeight:600,
                textDecoration:'none', boxShadow:'0 8px 24px rgba(30,144,255,.30)',
              }}>
                Conversar agora no WhatsApp
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { v:'< 1 min', l:'Tempo médio resposta' },
                { v:'7 dias', l:'Por semana, sempre' },
                { v:'WhatsApp', l:'Sem ticket, direto com humano' },
              ].map((s,i)=>(
                <div key={i} style={{ padding:'16px 20px', background:'rgba(255,255,255,.03)', border:`1px solid ${_BORDER}`, borderRadius:12, display:'flex', alignItems:'baseline', gap:14 }}>
                  <div style={{ fontFamily:'Space Grotesk', fontSize:24, fontWeight:600, ...(_GRAD_TEXT), letterSpacing:'-.01em', minWidth:90 }}>{s.v}</div>
                  <div style={{ fontSize:13, color:_TEXT3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 8. TECH STACK — stack tecnológica usada (credibilidade técnica)
// ─────────────────────────────────────────────────────────────────────
function TechStack() {
  const tech = [
    { name:'Supabase',   desc:'Banco + Auth + Realtime' },
    { name:'Vercel',     desc:'Edge global, deploy instantâneo' },
    { name:'Anthropic',  desc:'Claude — IA da operação' },
    { name:'Evolution',  desc:'API WhatsApp escalável' },
    { name:'Stripe',     desc:'Pagamentos confiáveis' },
    { name:'Cloudflare', desc:'CDN + DDoS protection' },
  ];
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>◇ Stack tecnológica</div>
          <h2 style={{ fontFamily:'Space Grotesk', fontSize:'clamp(32px,4vw,52px)', fontWeight:600, letterSpacing:'-.02em', color:_TEXT1, lineHeight:1.1, marginBottom:16 }}>
            Rodamos na mesma stack que <span style={_GRAD_TEXT}>OpenAI, Stripe e Notion</span> usam.
          </h2>
          <p style={{ fontSize:17, color:_TEXT2, maxWidth:600, margin:'0 auto', lineHeight:1.5 }}>
            Infraestrutura de nível mundial pra que sua operação nunca pare. Sem servidor próprio, sem dor de cabeça.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
          {tech.map((t,i)=>(
            <div key={i} style={{
              padding:'24px 20px', background:_CARD_BG, border:`1px solid ${_BORDER}`,
              borderRadius:14, textAlign:'center', transition:'transform .2s',
            }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
            >
              <div style={{ fontFamily:'Space Grotesk', fontSize:20, color:_TEXT1, fontWeight:600, marginBottom:6 }}>{t.name}</div>
              <div style={{ fontSize:12, color:_TEXT3, lineHeight:1.4 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// 9. FOUNDER SHOWCASE — foto founder + quote + assinatura
// ─────────────────────────────────────────────────────────────────────
function FounderShowcase() {
  return (
    <section className="reveal" style={{ background:_BG, padding:'80px 24px 120px', borderTop:`1px solid ${_BORDER}`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top, rgba(123,63,228,.10) 0%, transparent 50%)', pointerEvents:'none' }}/>
      <div style={{ maxWidth:1000, margin:'0 auto', position:'relative' }}>
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:60, alignItems:'center' }} className="cs-grid">
          {/* Avatar Founder */}
          <div style={{
            width:240, height:240, borderRadius:'50%',
            background:'linear-gradient(135deg,#7B3FE4 0%,#1E90FF 100%)',
            padding:4, flexShrink:0, position:'relative',
            boxShadow:'0 20px 60px rgba(123,63,228,.3)',
          }}>
            <div style={{
              width:'100%', height:'100%', borderRadius:'50%',
              background:'#0A0A0F', display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Space Grotesk', fontSize:80, fontWeight:300, color:'#F5F5F7',
              backgroundImage:'url(/admin/app/jhonattan.jpg)', backgroundSize:'cover', backgroundPosition:'center',
            }}>
              {/* Fallback caso a foto nao carregue */}
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize:11, color:_TEXT3, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:18 }}>◇ Carta do fundador</div>
            <p style={{ fontFamily:'Space Grotesk', fontSize:'clamp(20px,2.4vw,28px)', color:_TEXT1, lineHeight:1.4, fontWeight:400, marginBottom:24, letterSpacing:'-.01em' }}>
              "Construí a Brava porque cansei de ver empresa boa perder cliente por WhatsApp bagunçado.
              Hoje a gente entrega o que a sua operação merece: tecnologia séria, sem complicação."
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div>
                <div style={{ fontFamily:'Space Grotesk', fontSize:18, color:_TEXT1, fontWeight:600 }}>Jhonattan Itiuba</div>
                <div style={{ fontSize:13, color:_TEXT3 }}>Fundador & CEO · Brava Company</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.TypographyStatement = TypographyStatement;
window.MockupMacBook       = MockupMacBook;
window.MockupSplit         = MockupSplit;
window.BenefitsExclusive   = BenefitsExclusive;
window.Testimonials        = Testimonials;
window.CaseStudy           = CaseStudy;
window.SupportCard         = SupportCard;
window.TechStack           = TechStack;
window.FounderShowcase     = FounderShowcase;
