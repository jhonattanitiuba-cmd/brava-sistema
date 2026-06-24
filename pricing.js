// pricing.js — FONTE ÚNICA DE EXIBIÇÃO dos planos da Brava.
// Snapshot da tabela `planos` (Supabase), pras páginas estáticas (LP, checkout, app)
// renderizarem sem depender de fetch. A edge de cobrança lê a TABELA (verdade do preço).
// Ao mudar preço/escopo: atualize a tabela `planos` E este arquivo.
// O guard scripts/check-pricing.js falha o PR se este arquivo divergir da tabela.
(function () {
  window.BRAVA_PLANOS = [
    {
      id: 'essencial', nome: 'Essencial', ordem: 1, preco_mensal: 1297, badge: null,
      tag: 'Pra começar a profissionalizar agora',
      perfil: 'Profissional ou negócio que está começando a se organizar e quer vender melhor.',
      limite_atendentes: 3, limite_whatsapp: 1,
      entregaveis: [
        'Inbox compartilhada',
        'Agente de IA básico',
        'Etiquetas, contatos e respostas rápidas',
        'Configuração guiada pela Brava',
      ],
    },
    {
      id: 'performance', nome: 'Performance', ordem: 2, preco_mensal: 2497, badge: 'MAIS ESCOLHIDO',
      tag: 'CRM + Site profissional integrado',
      perfil: 'PME em crescimento que quer comercial, marca própria e os primeiros processos no lugar.',
      limite_atendentes: 10, limite_whatsapp: 2,
      entregaveis: [
        'Pipeline de vendas (funil kanban)',
        'Analytics e relatórios completos',
        'Múltiplos agentes de IA configuráveis',
        'Automações e follow-up automático',
        'White-label completo (seu logo, suas cores)',
        'Suporte em até 4h úteis',
      ],
    },
    {
      id: 'scale', nome: 'Scale', ordem: 3, preco_mensal: 4697, badge: null,
      tag: 'Operações grandes, multi-canal',
      perfil: 'Operação consolidada ou multi-unidade, com tráfego, site e vários times.',
      limite_atendentes: 30, limite_whatsapp: 5,
      entregaveis: [
        'Site institucional incluso (integrado ao CRM)',
        'API REST e webhooks',
        'Integração com n8n',
        'Múltiplos pipelines',
        'Suporte prioritário em até 1h',
      ],
    },
    {
      id: 'enterprise', nome: 'Enterprise', ordem: 4, preco_mensal: null, badge: null,
      tag: 'Personalização total e SLA dedicado',
      perfil: 'Grupos, franquias e redes que precisam de personalização total e SLA dedicado.',
      limite_atendentes: null, limite_whatsapp: null,
      entregaveis: [
        'Atendentes ilimitados',
        'Domínio próprio (crm.suaempresa.com.br)',
        'SSO corporativo',
        'Gerente de conta dedicado',
        'Onboarding com treinamento da equipe',
        'SLA de resposta em 30 minutos',
      ],
    },
  ];

  // Helpers compartilhados
  window.bravaPlanoById = function (id) {
    return window.BRAVA_PLANOS.find(function (p) { return p.id === id; }) || null;
  };
  window.bravaPrecoFmt = function (p) {
    var v = (p && typeof p === 'object') ? p.preco_mensal : p;
    if (v == null) return 'Sob consulta';
    return 'R$ ' + Number(v).toLocaleString('pt-BR');
  };
  // Monta a lista de entregáveis acumulada (tudo dos planos anteriores + os deste nível)
  window.bravaEntregaveisAcumulados = function (id) {
    var alvo = window.bravaPlanoById(id);
    if (!alvo) return [];
    return window.BRAVA_PLANOS
      .filter(function (p) { return p.ordem <= alvo.ordem; })
      .sort(function (a, b) { return a.ordem - b.ordem; })
      .reduce(function (acc, p) { return acc.concat(p.entregaveis); }, []);
  };
})();
