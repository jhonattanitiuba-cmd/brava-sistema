/* global React */
// ═══════════════════════════════════════════════════════════════════
// FEATURE ICONS — ícones contextuais pra features de LP
// ═══════════════════════════════════════════════════════════════════
// Em vez do mesmo check ✓ repetido em todas as features, esta lib
// detecta keywords no texto e retorna um SVG específico (Lucide-style).
//
// Uso:
//   <FeatureIcon text="3 atendentes" size={16} />
//   <FeatureIcon text="API REST e webhooks" size={16} />
//
// Visual: ícone dentro de uma "tile" sutil (8x8 rounded com bg + border)
// pra dar peso visual sem ser pesado. Cor gradiente sutil no hover.
// ═══════════════════════════════════════════════════════════════════

// Mapping: cada keyword vira um SVG path
// Ordem importa — primeira match ganha.
const _ICON_MAP = [
  // PESSOAS / TIME
  { kw: ['atendent','atendentes','agentes humanos','operador'], svg: 'users' },
  { kw: ['ilimitado','sem limite'], svg: 'infinity' },
  { kw: ['gerente de conta','account manager','dedicado'], svg: 'briefcase' },
  { kw: ['treinamento','onboarding','equipe'], svg: 'graduation' },

  // WHATSAPP / CANAIS
  { kw: ['número whatsapp','whatsapp','numero whatsapp'], svg: 'whatsapp' },
  { kw: ['multi-canal','multicanal','canais'], svg: 'share' },
  { kw: ['inbox','caixa de entrada'], svg: 'inbox' },

  // IA / AUTOMACAO
  { kw: ['agente de ia','ia','agente ia','agentes de ia'], svg: 'sparkles' },
  { kw: ['automaç','automatizad','follow-up automático'], svg: 'zap' },

  // CRM / GESTAO
  { kw: ['pipeline','funil','kanban','funis','pipelines'], svg: 'kanban' },
  { kw: ['etiqueta','tag','contatos','respostas rápidas'], svg: 'tag' },
  { kw: ['analytics','relatório','métrica','dashboard'], svg: 'chart' },

  // SITE / WEB
  { kw: ['site institucional','site profissional','landing','site'], svg: 'monitor' },
  { kw: ['domínio próprio','dominio proprio','dns'], svg: 'globe' },

  // BRANDING
  { kw: ['white-label','seu logo','suas cores','branding','personalizaç'], svg: 'palette' },

  // SUPORTE
  { kw: ['suporte em até','suporte prioritário','sla','suporte'], svg: 'lifebuoy' },

  // TECNICO / INTEGRACAO
  { kw: ['api rest','webhook','api'], svg: 'code' },
  { kw: ['n8n','integraç','zapier'], svg: 'workflow' },
  { kw: ['sso','single sign','autenticaç'], svg: 'key' },

  // CONFIGURACAO
  { kw: ['configuraç','setup','guiada'], svg: 'settings' },

  // BENEFITS específicos (BenefitsBlock)
  { kw: ['dorme tranquilo','24h','noite','plantão'], svg: 'moon' },
  { kw: ['produtiv','equipe vira','equipe ganha','atendente'], svg: 'trending' },
  { kw: ['perde lead','não perde','nunca mais perde','todo lead'], svg: 'target' },
  { kw: ['anúncio','vale cada','de onde veio','origem','atribuiç'], svg: 'chart' },
  { kw: ['carteira','leva sua','sai não leva','protegid','seguro'], svg: 'shield' },
  { kw: ['padrão grande','grande empresa','padrão','enterprise feel'], svg: 'award' },
  { kw: ['ticket médio','aumenta ticket','upsell','recuper','convers'], svg: 'trending' },
  { kw: ['marca aparece','sua marca','cada interaç','brand'], svg: 'palette' },
  { kw: ['economia','custo','paga uma','assinatura só','fornecedor'], svg: 'wallet' },
  { kw: ['conversa entre si','integra','tudo junto','sem exportar'], svg: 'link' },
];

// Biblioteca de SVG paths (Lucide-inspired, stroke 1.8)
const _SVG_PATHS = {
  users:     <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  whatsapp:  <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
  inbox:     <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
  sparkles:  <><path d="M12 3l1.91 5.79L20 10.41l-4.5 4.39L16.82 21 12 18.27 7.18 21l1.32-6.2L4 10.41l6.09-1.62L12 3z"/></>,
  zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  kanban:    <><rect x="3" y="3" width="6" height="14" rx="1"/><rect x="11" y="3" width="6" height="10" rx="1"/><path d="M19 3h2v18h-2"/></>,
  tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  chart:     <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
  monitor:   <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  palette:   <><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/></>,
  lifebuoy:  <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></>,
  code:      <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  workflow:  <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6a3 3 0 0 1 3 3v6"/></>,
  key:       <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
  settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  infinity:  <><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.739-8z"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  graduation:<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
  share:     <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
  // BENEFITS extras
  moon:      <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  target:    <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  award:     <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
  wallet:    <><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M2 6v12a2 2 0 0 0 2 2h16v-4"/><path d="M18 12h4v4h-4a2 2 0 0 1 0-4z"/></>,
  link:      <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  // FALLBACK: check minimal (último recurso)
  check:     <><polyline points="20 6 9 17 4 12"/></>,
};

function _resolveIconKey(text) {
  if (!text || typeof text !== 'string') return 'check';
  const lower = text.toLowerCase();
  for (const { kw, svg } of _ICON_MAP) {
    if (kw.some(k => lower.includes(k))) return svg;
  }
  return 'check';
}

// Componente principal: tile com icon + lookup automatico
function FeatureIcon({ text, size = 18, color = '#1E90FF', tileBg, tileBorder, tile = true }) {
  const key = _resolveIconKey(text);
  const paths = _SVG_PATHS[key] || _SVG_PATHS.check;
  const stroke = key === 'check' ? 2.4 : 1.8;
  const svg = (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </svg>
  );
  if (!tile) return svg;
  return (
    <span style={{
      flexShrink:0, width: size + 14, height: size + 14, borderRadius: 8,
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      background: tileBg || 'rgba(30,144,255,.08)',
      border: `1px solid ${tileBorder || 'rgba(30,144,255,.18)'}`,
      transition: 'background .2s, border-color .2s',
    }}>{svg}</span>
  );
}

window.FeatureIcon = FeatureIcon;
