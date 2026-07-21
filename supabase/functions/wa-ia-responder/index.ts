import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const SUPA_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

const PROMPT_FALLBACK = `Você é um assistente virtual profissional. Responda de forma curta e gentil em português brasileiro.`;
const DEBOUNCE_MS = 2000;

// Instrução global SEMPRE anexada (agente cliente e copiloto). Tira a "cara de IA".
const HUMANIZACAO_INSTRUCTION = `

# ESTILO HUMANO (regra absoluta, vale acima de tudo)
Você está no WhatsApp. Escreva como uma PESSOA REAL brasileira escreve, nunca como um robô.

NUNCA use travessão (— ou –) em hipótese alguma. Travessão denuncia que é IA. No lugar:
- use vírgula, ponto, ou dois pontos
- ou quebre em duas frases
- ou use parênteses
Exemplo errado: "O plano Performance custa R$ 1.990 — já vem com setup."
Exemplo certo: "O plano Performance custa R$ 1.990, já vem com setup."

Outras regras de naturalidade:
- Frases curtas, linguagem coloquial brasileira (pode usar "tá", "pra", "beleza", "show").
- Evite vocabulário pomposo ou de manual ("outrossim", "ademais", "supracitado", "trata-se de").
- Não comece toda resposta com "Claro!", "Com certeza!", "Perfeito!". Varie ou vá direto.
- Sem listas com marcadores formais (•, -) em conversa casual; escreva corrido como gente fala.
- Emojis só quando soam naturais e com parcimônia, nunca decorativos em excesso.
- Não repita o nome da pessoa em toda mensagem.`;

// Instrucao adicionada ao prompt quando split esta habilitado
const SPLIT_INSTRUCTION = `

# QUEBRA EM MÚLTIPLAS MENSAGENS (importante!)
Para parecer humano de verdade, você DEVE dividir respostas com mais de uma ideia em mensagens curtas.

Use a marca \`[SPLIT]\` em uma linha sozinha pra indicar onde quebrar.

Quando dividir:
- Resposta tem múltiplas info (ex: preço + setup + agendamento) → 3 mensagens
- Confirmação curta + nova pergunta → 2 mensagens
- Pessoa pergunta 2 coisas → 2 mensagens, uma pra cada

Quando NÃO dividir:
- Resposta curta (até ~15 palavras) → 1 mensagem só
- Cumprimento + 1 pergunta → 1 mensagem

Exemplo:
\`\`\`
Show, o *Performance* sai R$ 1.990/mês.
[SPLIT]
Já vem com setup incluso e 2 números de WhatsApp.
[SPLIT]
Quer agendar uma demo de 30min pra ver rodando?
\`\`\`

Cada parte deve ter sentido completo sozinha. Máximo 3 mensagens.`;

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': '*',
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

// 🔒 Autenticação do webhook (segredo compartilhado).
//    Sem isso, qualquer um pode forjar um POST e injetar mensagens falsas
//    e/ou acionar o Copiloto operador (execução de SQL, envio de mensagens).
//    O segredo deve ser configurado como env var no Supabase (WA_WEBHOOK_SECRET)
//    e enviado pelo chamador legítimo (Database Webhook) no header 'x-webhook-secret'
//    ou 'Authorization: Bearer <segredo>'.
const WEBHOOK_SECRET = (Deno.env.get('WA_WEBHOOK_SECRET') || '').trim();

// Comparação de tempo constante — evita timing attack na verificação do segredo.
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  // Compara sempre o mesmo número de bytes pra não vazar o tamanho no tempo.
  const len = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

// Extrai o segredo enviado pelo chamador. Prioriza o header customizado
// 'x-webhook-secret' (não colide com o Authorization usado pelo JWT da plataforma).
function extrairSegredoWebhook(req: Request): string {
  const custom = (req.headers.get('x-webhook-secret') || '').trim();
  if (custom) return custom;
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

// Retorna null se autorizado; caso contrário, a Response de erro a devolver.
function checarAutenticacaoWebhook(req: Request): Response | null {
  // Fail-closed: sem segredo configurado, recusa tudo (não abre em modo inseguro).
  if (!WEBHOOK_SECRET) {
    console.error('[wa-ia-responder] WA_WEBHOOK_SECRET não configurado — recusando a requisição.');
    return json(503, { error: 'webhook_secret_not_configured' });
  }
  if (!timingSafeEqual(extrairSegredoWebhook(req), WEBHOOK_SECRET)) {
    return json(401, { error: 'unauthorized' });
  }
  return null;
}

// --- Endurecimento do Copiloto operador ---
// Sessão do copiloto tem duração máxima absoluta; depois exige reativação com PIN.
const COPILOT_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

// Throttle best-effort de tentativas de PIN por remetente (barreira contra brute force).
// Nota: edge functions são efêmeras e multi-instância, então este contador é por
// instância — não é um lockout global forte. O controle real do acesso continua sendo
// o PIN obrigatório (fail-closed) + a allowlist de operadores (BRAVA_OPERADOR_JIDS).
const PIN_MAX_ATTEMPTS = 5;
const PIN_WINDOW_MS = 10 * 60 * 1000; // 10 min
const pinAttempts = new Map<string, { count: number; first: number }>();

// Registra uma tentativa; retorna false quando o remetente estourou o limite na janela.
function registrarTentativaPin(sender: string): boolean {
  const now = Date.now();
  const rec = pinAttempts.get(sender);
  if (!rec || now - rec.first > PIN_WINDOW_MS) {
    pinAttempts.set(sender, { count: 1, first: now });
    return true;
  }
  rec.count++;
  return rec.count <= PIN_MAX_ATTEMPTS;
}
function limparTentativasPin(sender: string) { pinAttempts.delete(sender); }

async function enviarPresencaDigitando(inst: any, number: string, durationMs: number) {
  try {
    const url = inst.evolution_url.replace(/\/+$/, '') + `/chat/sendPresence/${encodeURIComponent(inst.evolution_instance_name)}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: inst.evolution_apikey },
      body: JSON.stringify({ number, presence: 'composing', delay: durationMs }),
    });
  } catch (e) { console.warn('[ai] presence failed:', e); }
}

async function chamarClaude(model: string, system: string, history: Array<{role: string, content: string}>) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-sonnet-4-5',
      max_tokens: 500,
      system,
      messages: history,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

// Rede de segurança: troca travessões que a IA deixar passar antes de enviar.
// Garante que NENHUMA mensagem da Brava sai com travessão (entrega de IA).
function limparTravessao(text: string): string {
  if (!text) return text;
  return text
    // travessão/en-dash entre espaços vira vírgula: "X — Y" -> "X, Y"
    .replace(/\s+[—–]\s+/g, ', ')
    // travessão grudado ou início de linha vira nada/espaço
    .replace(/[—–]/g, '-');
}

async function enviarMensagemEvolution(inst: any, number: string, text: string) {
  const url = inst.evolution_url.replace(/\/+$/, '') + `/message/sendText/${encodeURIComponent(inst.evolution_instance_name)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: inst.evolution_apikey },
    body: JSON.stringify({ number, text: limparTravessao(text) }),
  });
  if (!res.ok) throw new Error(`Evolution sendText ${res.status}`);
  return res.json();
}

// Calcula delay humanizado para um chunk baseado no tamanho
function calcularDelayChunk(text: string): number {
  const chars = text.length;
  // ~50 chars/segundo de leitura+digitação humana
  const ms = chars * 30;
  return Math.min(Math.max(ms, 1200), 3500); // min 1.2s, max 3.5s por chunk
}

async function processarResposta(record: any, inst: any) {
  const chatJid = record.chat_jid;
  const numero = chatJid.replace('@s.whatsapp.net', '').replace('@c.us', '');
  const typingOn = inst.ai_typing_enabled !== false;
  const splitOn = inst.ai_split_enabled !== false;
  const thinkingSec = Math.max(0, Math.min(10, Number(inst.ai_thinking_seconds ?? 3)));
  const thinkingTotalMs = thinkingSec * 1000;

  try {
    // 1) "Digitando..." imediato
    if (typingOn) {
      await enviarPresencaDigitando(inst, numero, DEBOUNCE_MS + thinkingTotalMs + 4000);
    }

    // 2) Debounce 2s
    await new Promise(r => setTimeout(r, DEBOUNCE_MS));

    // 3) Recheck — se chegou msg mais nova, sai
    const { data: maisNovas } = await supa.from('wa_mensagens')
      .select('id')
      .eq('instancia_id', record.instancia_id)
      .eq('chat_jid', chatJid)
      .eq('from_me', false)
      .gt('timestamp', record.timestamp)
      .limit(1);
    if (maisNovas && maisNovas.length > 0) return;

    // 4) Historico
    const { data: msgs } = await supa.from('wa_mensagens')
      .select('from_me, text, kind, timestamp')
      .eq('instancia_id', record.instancia_id)
      .eq('chat_jid', chatJid)
      .order('timestamp', { ascending: false })
      .limit(40);
    const ordenadas = (msgs || []).reverse();

    let rawHistory = ordenadas
      .filter((m: any) => m.text && m.text.trim().length > 0)
      .map((m: any) => ({ role: m.from_me ? 'assistant' : 'user', content: m.text }));
    const history: Array<{role: string, content: string}> = [];
    for (const m of rawHistory) {
      if (history.length > 0 && history[history.length - 1].role === m.role) {
        history[history.length - 1].content += '\n' + m.content;
      } else {
        history.push({ ...m });
      }
    }
    while (history.length > 0 && history[0].role !== 'user') history.shift();
    if (history.length === 0 || history[history.length - 1].role !== 'user') {
      history.push({ role: 'user', content: record.text || '' });
    }

    // 5) Chama Claude com instrucao de split + humanizacao (antitravessao sempre)
    const systemPrompt = (inst.ai_prompt || PROMPT_FALLBACK) + HUMANIZACAO_INSTRUCTION + (splitOn ? SPLIT_INSTRUCTION : '');
    const claudeStartTs = Date.now();
    const respostaCompleta = await chamarClaude(inst.ai_model, systemPrompt, history);
    if (!respostaCompleta) return;
    const claudeTookMs = Date.now() - claudeStartTs;

    // 6) Espera o tempo "pensando" antes da PRIMEIRA mensagem
    const aindaPrecisaEsperar = Math.max(0, thinkingTotalMs - claudeTookMs);
    if (aindaPrecisaEsperar > 0) {
      await new Promise(r => setTimeout(r, aindaPrecisaEsperar));
    }

    // 7) Quebra em chunks
    const chunks = splitOn
      ? respostaCompleta.split(/\n*\[SPLIT\]\n*/i).map(s => s.trim()).filter(Boolean).slice(0, 4)
      : [respostaCompleta];

    // 8) Envia cada chunk com presence entre eles
    const chunkIds: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (i > 0) {
        // Antes do proximo: mostra "digitando" + espera
        const delayProximo = calcularDelayChunk(chunk);
        if (typingOn) await enviarPresencaDigitando(inst, numero, delayProximo + 500);
        await new Promise(r => setTimeout(r, delayProximo));
      }
      try {
        const enviado = await enviarMensagemEvolution(inst, numero, chunk);
        const newId = enviado?.key?.id;
        if (newId) chunkIds.push(newId);
      } catch (e) {
        console.warn('[ai] chunk send fail:', e);
      }
    }

    await supa.from('wa_eventos_log').insert({
      instancia_id: record.instancia_id, event_type: 'ai.replied',
      payload: {
        chat_jid: chatJid, in_reply_to: record.message_id,
        response: respostaCompleta.slice(0, 400),
        chunks: chunks.length,
        history_len: history.length,
        claude_ms: claudeTookMs,
        thinking_sec: thinkingSec,
        typing_on: typingOn,
        split_on: splitOn,
      },
      processed: true,
    });
    // Marca chunks como ia_generated apos webhook gravar
    setTimeout(async () => {
      for (const cid of chunkIds) {
        await supa.from('wa_mensagens').update({ ia_generated: true })
          .eq('instancia_id', record.instancia_id).eq('message_id', cid);
      }
    }, 4000);
  } catch (e) {
    await supa.from('wa_eventos_log').insert({
      instancia_id: record.instancia_id, event_type: 'ai.error',
      payload: { chat_jid: chatJid, message_id: record.message_id, error: String(e) },
      error: String(e),
    });
  }
}

// ════════════════════════════════════════════════════════════════════
// COPILOTO INTERNO (modo operador) — agente Claude com tool-use sobre o
// sistema. Roda quando o remetente está no allowlist BRAVA_OPERADOR_JIDS.
// Modo LEITURA: só consulta dados, não executa ações ainda.
// ════════════════════════════════════════════════════════════════════

const COPILOTO_PROMPT = `Você é o *Copiloto da Brava*, o assistente interno do Jhonattan (dono da Brava Company), falando com ele pelo WhatsApp.

Seu papel NÃO é atender cliente. É ajudar o Jhonattan a entender e operar o negócio, consultando dados reais e executando ações no sistema pelas suas ferramentas.

VOCÊ TEM 4 CATEGORIAS DE FERRAMENTAS:

1) LEITURA GERAL: resumo_negocio, buscar_cliente, conversas_recentes, metricas_whatsapp.

2) LEITURA FINANCEIRA E OPERACIONAL: fluxo_caixa, parcelas_atrasadas, pagamentos_recentes, consultar_cliente_financeiro, previsao_recebimento, pipeline_propostas, projetos_em_implantacao, checkpoints_pendentes, agenda_hoje, proximas_entregas, o_que_falta_no_projeto.

3) AÇÕES (modo escrita, sem confirmação): marcar_parcela_paga, enviar_msg_cliente, criar_lembrete. Execute direto quando pedirem, sem pedir confirmação.

4) ACESSO DIRETO AO BANCO: executar_sql. Use SEMPRE QUE as tools curadas acima não bastarem: perguntas exploratórias ("quantos clientes do nicho X cresceram nos últimos 30 dias"), análises customizadas, ajustes em lote ("aumenta o vencimento_dia de todos os EstacionePark"), insights que precisam cruzar tabelas. Para escrever, lembre: só tabelas da allowlist (clientes, projetos, projeto_parcelas, projeto_checkpoints, project_checkpoints, projeto_etiquetas, cliente_etiquetas, projeto_checklists, projeto_checklist_itens, projeto_anexos, projeto_pagamentos, copiloto_*, fin_*, wa_chats, wa_contatos), e UPDATE/DELETE EXIGE WHERE. Tabelas-chave: clientes(id,nome,status), projetos(id,cliente,cliente_id,mensal,status_fase,vencimento_dia), projeto_parcelas(projeto_id,valor_esperado,data_vencimento_esperada,pago). PREFIRA as tools especializadas quando a pergunta já se encaixa nelas — executar_sql é o coringa, não o padrão.

REGRAS DE COMUNICAÇÃO:
- Português brasileiro, direto e curto, estilo mensagem de WhatsApp. Sem preâmbulo do tipo "Claro!", "Vou verificar...", vá direto ao ponto.
- Responda APENAS com a resposta final pro Jhonattan. Não escreva seu raciocínio nem mencione as ferramentas que usou.
- SEMPRE busque dados reais antes de afirmar números. NÃO invente. Se não tiver o dado, diga "não encontrei isso".
- Use *negrito* do WhatsApp pra destacar números importantes (R$, datas, nomes de cliente).
- Seja parceiro de negócio. Se notar algo relevante (cliente atrasado, entrega crítica próxima, conversa não respondida), aponte mesmo que não tenha sido perguntado.
- Datas no formato brasileiro DD/MM. Valores como R$ 1.234,56.
- Quando executar ação, confirme o que fez ("ok, marquei a parcela como paga", "mensagem enviada pra Garcia").`;

const COPILOTO_TOOLS = [
  // ───────── LEITURA GERAL ─────────
  { name: 'resumo_negocio', description: 'Visão geral do negócio: total de clientes, contagem por status, MRR ativo, nº de projetos, tamanho da equipe e top nichos.', input_schema: { type: 'object', properties: {} } },
  { name: 'buscar_cliente', description: 'Busca cliente pelo nome e retorna status, nicho, projetos e progresso. Use quando perguntarem sobre um cliente específico.', input_schema: { type: 'object', properties: { termo: { type: 'string', description: 'Nome ou parte do nome' } }, required: ['termo'] } },
  { name: 'conversas_recentes', description: 'Conversas de WhatsApp mais recentes (número, última mensagem, não-lidas). Use para "o que tá rolando" ou "quem tá aguardando resposta".', input_schema: { type: 'object', properties: { limite: { type: 'integer', description: 'Quantas (máx 25, padrão 10)' } } } },
  { name: 'metricas_whatsapp', description: 'Volume de mensagens nos últimos N dias (total, recebidas, IA, % IA).', input_schema: { type: 'object', properties: { dias: { type: 'integer', description: 'Janela em dias (máx 30, padrão 7)' } } } },

  // ───────── LEITURA FINANCEIRA ─────────
  { name: 'fluxo_caixa', description: 'Snapshot do fluxo de caixa: total já recebido, total pendente, atrasados, e previsão dividida em 30/60/90 dias. Use para "como tá o caixa", "fluxo", "previsão de receita".', input_schema: { type: 'object', properties: {} } },
  { name: 'parcelas_atrasadas', description: 'Lista de parcelas em atraso com cliente, valor, dias de atraso. Use para "quem tá devendo", "atrasados", "inadimplentes".', input_schema: { type: 'object', properties: { limite: { type: 'integer', description: 'Máx parcelas (padrão 20)' } } } },
  { name: 'pagamentos_recentes', description: 'Pagamentos recebidos no extrato bancário nos últimos N dias, com cliente identificado e categoria.', input_schema: { type: 'object', properties: { dias: { type: 'integer', description: 'Janela em dias (padrão 7, máx 60)' } } } },
  { name: 'consultar_cliente_financeiro', description: 'Situação financeira de um cliente: total recebido, total pendente, atrasado, próximas parcelas, histórico recente.', input_schema: { type: 'object', properties: { termo: { type: 'string', description: 'Nome do cliente' } }, required: ['termo'] } },
  { name: 'previsao_recebimento', description: 'Entradas previstas em uma janela de data específica (use para "o que entra essa semana", "amanhã", "dia 25").', input_schema: { type: 'object', properties: { data_inicio: { type: 'string', description: 'YYYY-MM-DD ou today' }, data_fim: { type: 'string', description: 'YYYY-MM-DD ou today+7' } } } },

  // ───────── LEITURA OPERACIONAL ─────────
  { name: 'pipeline_propostas', description: 'Propostas em aberto: enviadas, em negociação, leads. Valor potencial mensal e total.', input_schema: { type: 'object', properties: {} } },
  { name: 'projetos_em_implantacao', description: 'Projetos em fase de onboarding/implantação com prazo de entrega e progresso.', input_schema: { type: 'object', properties: {} } },
  { name: 'checkpoints_pendentes', description: 'Itens de checklist pendentes nos projetos ativos. Opcional: filtra por cliente.', input_schema: { type: 'object', properties: { cliente: { type: 'string', description: 'Nome do cliente (opcional)' } } } },
  { name: 'agenda_hoje', description: 'O que vence hoje: parcelas a receber, prazos de entrega, checkpoints com prazo expirando.', input_schema: { type: 'object', properties: {} } },
  { name: 'proximas_entregas', description: 'Próximas entregas/prazos contratuais (data_prazo_entrega) nos próximos N dias.', input_schema: { type: 'object', properties: { dias: { type: 'integer', description: 'Janela em dias (padrão 14)' } } } },
  { name: 'o_que_falta_no_projeto', description: 'Situação completa de um projeto: parcelas pendentes, checkpoints, prazo, observações.', input_schema: { type: 'object', properties: { termo: { type: 'string', description: 'Nome do cliente ou do projeto' } }, required: ['termo'] } },

  // ───────── AÇÕES (escrita, sem confirmação) ─────────
  { name: 'marcar_parcela_paga', description: 'Marca uma parcela específica como paga. Use quando o Jhonattan disser "marca X como pago" ou "recebi Y de Z".', input_schema: { type: 'object', properties: { cliente: { type: 'string', description: 'Nome do cliente da parcela' }, valor: { type: 'number', description: 'Valor recebido (R$)' }, data_pagamento: { type: 'string', description: 'YYYY-MM-DD ou today (padrão hoje)' } }, required: ['cliente', 'valor'] } },
  { name: 'enviar_msg_cliente', description: 'Envia uma mensagem de WhatsApp pra um cliente específico (via instância Brava Principal). Use quando pedirem "manda mensagem pra X", "avisa o Y".', input_schema: { type: 'object', properties: { cliente: { type: 'string', description: 'Nome do cliente OU número (5511...)' }, texto: { type: 'string', description: 'Texto exato da mensagem a enviar' } }, required: ['cliente', 'texto'] } },
  { name: 'criar_lembrete', description: 'Cria lembrete que o Copilot vai te enviar no WhatsApp na data e hora indicadas.', input_schema: { type: 'object', properties: { descricao: { type: 'string', description: 'O que lembrar' }, data: { type: 'string', description: 'YYYY-MM-DD HH:MM ou expressão (amanhã 9h, dia 25 10h)' } }, required: ['descricao', 'data'] } },

  // ───────── ACESSO DIRETO AO BANCO (use com inteligência) ─────────
  { name: 'executar_sql', description: 'Executa SQL direto no banco Postgres da Brava. Use quando as outras tools não dão a resposta exata, ou pra ações em lote.\n\nREGRAS:\n- SELECT/WITH/EXPLAIN são livres (qualquer tabela).\n- INSERT/UPDATE/DELETE só nas tabelas permitidas: clientes, projetos, projeto_parcelas, projeto_checkpoints, project_checkpoints, projeto_etiquetas, cliente_etiquetas, projeto_checklists, projeto_checklist_itens, projeto_anexos, projeto_pagamentos, copiloto_lembretes, copiloto_memoria, copiloto_estado, fin_caixa_lancamentos, fin_despesas, fin_despesas_pagamentos, fin_categoria_regras, fin_dre_categorias, fin_payer_aliases, fin_extrato_bancario, wa_chats, wa_contatos.\n- UPDATE/DELETE EXIGE WHERE.\n- DROP/TRUNCATE/ALTER/CREATE/GRANT/REVOKE são bloqueados.\n\nDICAS:\n- Tabelas-chave: clientes(id,nome,status,cliente_id), projetos(id,cliente,cliente_id,mensal,implementacao,vencimento_dia,status_fase), projeto_parcelas(projeto_id,valor_esperado,valor_recebido,data_vencimento_esperada,pago), fin_extrato_bancario(data,valor,descricao,categoria,cliente_id,projeto_id), wa_chats(jid,unread_count,last_message_ts).\n- Para ler quando não tiver certeza, faça SELECT primeiro pra confirmar antes de escrever.\n- Cite cliente por NOME quando possível, não por id, ao explicar pro dono.', input_schema: { type: 'object', properties: { query: { type: 'string', description: 'SQL completo. Aspas simples escapadas com duas aspas simples. Sem ponto-e-vírgula no final.' }, max_rows: { type: 'integer', description: 'Limite de linhas pra SELECT (padrão 100, máx 1000)' } }, required: ['query'] } },
];

async function toolResumoNegocio(): Promise<string> {
  const { data: clientes } = await supa.from('clientes').select('status, nicho');
  const { data: projetos } = await supa.from('projetos').select('status_fase, mensal');
  const { data: equipe } = await supa.from('usuarios').select('id');
  const cl = clientes || [], pj = projetos || [];
  const porStatus: Record<string, number> = {};
  cl.forEach((c: any) => { const k = c.status || '?'; porStatus[k] = (porStatus[k] || 0) + 1; });
  const mrr = pj.filter((p: any) => p.status_fase === 'ativo').reduce((s: number, p: any) => s + Number(p.mensal || 0), 0);
  const nichos: Record<string, number> = {};
  cl.forEach((c: any) => { if (c.nicho) nichos[c.nicho] = (nichos[c.nicho] || 0) + 1; });
  const topNichos = Object.entries(nichos).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, q]) => `${n}: ${q}`);
  return JSON.stringify({ total_clientes: cl.length, clientes_por_status: porStatus, mrr_ativo_reais: mrr, total_projetos: pj.length, tamanho_equipe: (equipe || []).length, top_nichos: topNichos });
}

async function toolBuscarCliente(termo: string): Promise<string> {
  if (!termo) return 'Informe o nome do cliente pra buscar.';
  const { data: cls } = await supa.from('clientes').select('id, nome, status, nicho').ilike('nome', '%' + termo + '%').limit(5);
  if (!cls || cls.length === 0) return 'Nenhum cliente encontrado com "' + termo + '".';
  const out: any[] = [];
  for (const c of cls) {
    const { data: pj } = await supa.from('projetos').select('status_fase, mensal, implementacao, nucleo').ilike('cliente', '%' + c.nome + '%').limit(3);
    const { data: cks } = await supa.from('project_checkpoints').select('done').ilike('cliente_nome', '%' + c.nome + '%');
    const total = (cks || []).length, done = (cks || []).filter((k: any) => k.done).length;
    out.push({ nome: c.nome, status: c.status, nicho: c.nicho, projetos: pj || [], checkpoints: total ? `${done}/${total} concluídos` : 'sem checkpoints' });
  }
  return JSON.stringify(out);
}

async function toolConversasRecentes(limite: any): Promise<string> {
  const lim = Math.min(Math.max(Number(limite || 10), 1), 25);
  const { data } = await supa.from('wa_chats')
    .select('jid, last_message_text, last_message_ts, unread_count, status')
    .not('last_message_ts', 'is', null)
    .order('last_message_ts', { ascending: false })
    .limit(lim);
  const out = (data || []).map((c: any) => ({
    numero: (c.jid || '').replace('@s.whatsapp.net', '').replace('@g.us', ' (grupo)'),
    ultima_msg: (c.last_message_text || '').slice(0, 80),
    nao_lidas: c.unread_count || 0,
    status: c.status,
  }));
  return JSON.stringify(out);
}

async function toolMetricasWhatsapp(dias: any): Promise<string> {
  const d = Math.min(Math.max(Number(dias || 7), 1), 30);
  const cutoff = new Date(Date.now() - d * 86400000).toISOString();
  const { count: total } = await supa.from('wa_mensagens').select('*', { count: 'exact', head: true }).gte('timestamp', cutoff);
  const { count: ia } = await supa.from('wa_mensagens').select('*', { count: 'exact', head: true }).gte('timestamp', cutoff).eq('ia_generated', true);
  const { count: recebidas } = await supa.from('wa_mensagens').select('*', { count: 'exact', head: true }).gte('timestamp', cutoff).eq('from_me', false);
  const t = total || 0;
  return JSON.stringify({ periodo_dias: d, total_mensagens: t, recebidas: recebidas || 0, geradas_por_ia: ia || 0, percent_ia: t ? Math.round((ia || 0) / t * 100) : 0 });
}

// ════════════════════════════════════════════════════════════════════
// TOOLS FINANCEIRAS (etapa A)
// ════════════════════════════════════════════════════════════════════

async function toolFluxoCaixa(): Promise<string> {
  const hoje = new Date().toISOString().slice(0, 10);
  const t = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const r = await Promise.all([
    supa.from('projeto_parcelas').select('valor_recebido').eq('pago', true),
    supa.from('projeto_parcelas').select('valor_esperado').eq('pago', false),
    supa.from('projeto_parcelas').select('valor_esperado, data_vencimento_esperada').eq('pago', false).lt('data_vencimento_esperada', hoje),
    supa.from('projeto_parcelas').select('valor_esperado').eq('pago', false).gte('data_vencimento_esperada', hoje).lte('data_vencimento_esperada', t(30)),
    supa.from('projeto_parcelas').select('valor_esperado').eq('pago', false).gt('data_vencimento_esperada', t(30)).lte('data_vencimento_esperada', t(60)),
    supa.from('projeto_parcelas').select('valor_esperado').eq('pago', false).gt('data_vencimento_esperada', t(60)).lte('data_vencimento_esperada', t(90)),
  ]);
  const sum = (x: any) => (x.data || []).reduce((s: number, p: any) => s + Number(p.valor_recebido ?? p.valor_esperado ?? 0), 0);
  return JSON.stringify({
    ja_recebido: sum(r[0]),
    pendente_total: sum(r[1]),
    atrasado_total: sum(r[2]),
    atrasado_qtd: (r[2].data || []).length,
    previsto_30d: sum(r[3]),
    previsto_31_60d: sum(r[4]),
    previsto_61_90d: sum(r[5]),
    referencia: hoje,
  });
}

async function toolParcelasAtrasadas(limite: any): Promise<string> {
  const lim = Math.min(Math.max(Number(limite || 20), 1), 50);
  const hoje = new Date().toISOString().slice(0, 10);
  const { data } = await supa
    .from('projeto_parcelas')
    .select('valor_esperado, data_vencimento_esperada, descricao, projeto_id')
    .eq('pago', false).lt('data_vencimento_esperada', hoje)
    .order('data_vencimento_esperada', { ascending: true }).limit(lim);
  if (!data || data.length === 0) return JSON.stringify({ msg: 'Nenhuma parcela atrasada.' });
  const projIds = [...new Set(data.map((p: any) => p.projeto_id))];
  const { data: projs } = await supa.from('projetos').select('id, cliente, servico').in('id', projIds as any);
  const projMap: Record<string, any> = {};
  (projs || []).forEach((p: any) => { projMap[p.id] = p; });
  const out = data.map((p: any) => ({
    cliente: projMap[p.projeto_id]?.cliente || '?',
    servico: projMap[p.projeto_id]?.servico,
    descricao: p.descricao,
    valor: Number(p.valor_esperado),
    venc: p.data_vencimento_esperada,
    dias_atraso: Math.floor((Date.now() - new Date(p.data_vencimento_esperada).getTime()) / 86400000),
  }));
  return JSON.stringify({ total: out.length, soma_atrasada: out.reduce((s, o) => s + o.valor, 0), parcelas: out });
}

async function toolPagamentosRecentes(dias: any): Promise<string> {
  const d = Math.min(Math.max(Number(dias || 7), 1), 60);
  const cutoff = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
  const { data } = await supa
    .from('fin_extrato_bancario')
    .select('data, valor, descricao, categoria, cliente_id')
    .gt('valor', 0).gte('data', cutoff)
    .order('data', { ascending: false }).limit(40);
  const clienteIds = [...new Set((data || []).map((p: any) => p.cliente_id).filter(Boolean))];
  const { data: clientes } = await supa.from('clientes').select('id, nome').in('id', clienteIds as any);
  const clMap: Record<string, string> = {};
  (clientes || []).forEach((c: any) => { clMap[c.id] = c.nome; });
  const out = (data || []).map((p: any) => ({
    data: p.data,
    valor: Number(p.valor),
    descricao: (p.descricao || '').slice(0, 80),
    categoria: p.categoria,
    cliente: p.cliente_id ? (clMap[p.cliente_id] || '?') : null,
  }));
  return JSON.stringify({ periodo_dias: d, total: out.length, soma: out.reduce((s, o) => s + o.valor, 0), pagamentos: out });
}

async function toolConsultarClienteFinanceiro(termo: string): Promise<string> {
  if (!termo) return 'Informe o nome do cliente.';
  const { data: cls } = await supa.from('clientes').select('id, nome, status, nicho').ilike('nome', '%' + termo + '%').limit(3);
  if (!cls || cls.length === 0) return 'Cliente "' + termo + '" não encontrado.';
  const out: any[] = [];
  for (const c of cls) {
    const { data: projs } = await supa.from('projetos').select('id, cliente, servico, mensal, status_fase, vencimento_dia').eq('cliente_id', c.id);
    const projIds = (projs || []).map((p: any) => p.id);
    if (projIds.length === 0) { out.push({ cliente: c.nome, sem_projeto: true }); continue; }
    const { data: pcs } = await supa.from('projeto_parcelas').select('valor_esperado, valor_recebido, pago, data_vencimento_esperada, descricao').in('projeto_id', projIds as any);
    const recebido = (pcs || []).filter((p: any) => p.pago).reduce((s: number, p: any) => s + Number(p.valor_recebido || 0), 0);
    const pendente = (pcs || []).filter((p: any) => !p.pago).reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0);
    const hoje = new Date().toISOString().slice(0, 10);
    const atrasadas = (pcs || []).filter((p: any) => !p.pago && p.data_vencimento_esperada < hoje);
    const proximas = (pcs || []).filter((p: any) => !p.pago && p.data_vencimento_esperada >= hoje).sort((a: any, b: any) => a.data_vencimento_esperada.localeCompare(b.data_vencimento_esperada)).slice(0, 5);
    out.push({
      cliente: c.nome, status: c.status,
      projetos: (projs || []).map((p: any) => ({ servico: p.servico, mensal: Number(p.mensal || 0), fase: p.status_fase, venc_dia: p.vencimento_dia })),
      ja_recebido: recebido,
      pendente_total: pendente,
      atrasado_qtd: atrasadas.length,
      atrasado_valor: atrasadas.reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0),
      proximas_parcelas: proximas.map((p: any) => ({ desc: p.descricao, valor: Number(p.valor_esperado), venc: p.data_vencimento_esperada })),
    });
  }
  return JSON.stringify(out);
}

async function toolPrevisaoRecebimento(data_inicio: string, data_fim: string): Promise<string> {
  const norm = (s: any, fallback: string) => {
    if (!s || s === 'today') return fallback;
    return String(s);
  };
  const hoje = new Date().toISOString().slice(0, 10);
  const ini = norm(data_inicio, hoje);
  const t = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const fim = norm(data_fim, t(7));
  const { data } = await supa
    .from('projeto_parcelas')
    .select('valor_esperado, data_vencimento_esperada, descricao, projeto_id')
    .eq('pago', false).gte('data_vencimento_esperada', ini).lte('data_vencimento_esperada', fim)
    .order('data_vencimento_esperada', { ascending: true });
  const projIds = [...new Set((data || []).map((p: any) => p.projeto_id))];
  const { data: projs } = await supa.from('projetos').select('id, cliente').in('id', projIds as any);
  const pm: Record<string, string> = {};
  (projs || []).forEach((p: any) => { pm[p.id] = p.cliente; });
  const out = (data || []).map((p: any) => ({
    data: p.data_vencimento_esperada,
    cliente: pm[p.projeto_id] || '?',
    descricao: p.descricao,
    valor: Number(p.valor_esperado),
  }));
  return JSON.stringify({ janela: { ini, fim }, total: out.length, soma: out.reduce((s, o) => s + o.valor, 0), parcelas: out });
}

// ════════════════════════════════════════════════════════════════════
// TOOLS PIPELINE / OPERAÇÃO (etapa B)
// ════════════════════════════════════════════════════════════════════

async function toolPipelinePropostas(): Promise<string> {
  const { data } = await supa.from('projetos')
    .select('cliente, servico, mensal, valor_total_acordado, implementacao, status_fase, data_fechamento_proposta')
    .in('status_fase', ['proposta_enviada', 'em_negociacao', 'lead'])
    .order('mensal', { ascending: false });
  const grupos: Record<string, any[]> = {};
  (data || []).forEach((p: any) => {
    const k = p.status_fase || '?';
    if (!grupos[k]) grupos[k] = [];
    grupos[k].push({ cliente: p.cliente, servico: p.servico, mensal: Number(p.mensal || 0), implant: Number(p.implementacao || 0) });
  });
  const sumar = (arr: any[]) => arr.reduce((s, p) => s + p.mensal, 0);
  return JSON.stringify({
    total: (data || []).length,
    mrr_potencial_total: sumar(data || []),
    por_fase: Object.fromEntries(Object.entries(grupos).map(([k, v]) => [k, { qtd: v.length, mrr_potencial: sumar(v), projetos: v }])),
  });
}

async function toolProjetosEmImplantacao(): Promise<string> {
  const { data } = await supa.from('projetos')
    .select('cliente, servico, status_fase, data_inicio, data_prazo_entrega, data_entrega_real, mensal, implementacao')
    .in('status_fase', ['onboarding', 'em_implantacao', 'em_implementacao'])
    .order('data_prazo_entrega', { ascending: true });
  return JSON.stringify({
    total: (data || []).length,
    projetos: (data || []).map((p: any) => ({
      cliente: p.cliente,
      servico: p.servico,
      fase: p.status_fase,
      inicio: p.data_inicio,
      prazo: p.data_prazo_entrega,
      entregue: p.data_entrega_real,
      dias_para_prazo: p.data_prazo_entrega ? Math.floor((new Date(p.data_prazo_entrega).getTime() - Date.now()) / 86400000) : null,
      mensal: Number(p.mensal || 0),
    })),
  });
}

async function toolCheckpointsPendentes(cliente: any): Promise<string> {
  let q = supa.from('project_checkpoints').select('cliente_nome, titulo, fase, descricao, ordem').eq('done', false);
  if (cliente) q = q.ilike('cliente_nome', '%' + cliente + '%');
  const { data } = await q.order('ordem', { ascending: true }).limit(30);
  return JSON.stringify({ total: (data || []).length, pendentes: data || [] });
}

// ════════════════════════════════════════════════════════════════════
// TOOLS TEMPO / CALENDÁRIO (etapa C)
// ════════════════════════════════════════════════════════════════════

async function toolAgendaHoje(): Promise<string> {
  const hoje = new Date().toISOString().slice(0, 10);
  const [parcelasRes, prazosRes] = await Promise.all([
    supa.from('projeto_parcelas').select('valor_esperado, descricao, projeto_id').eq('pago', false).eq('data_vencimento_esperada', hoje),
    supa.from('projetos').select('cliente, servico, data_prazo_entrega').eq('data_prazo_entrega', hoje),
  ]);
  const parcelas = parcelasRes.data || [];
  const projIds = [...new Set(parcelas.map((p: any) => p.projeto_id))];
  const { data: projs } = await supa.from('projetos').select('id, cliente').in('id', projIds as any);
  const pm: Record<string, string> = {};
  (projs || []).forEach((p: any) => { pm[p.id] = p.cliente; });
  return JSON.stringify({
    data: hoje,
    parcelas_a_receber: parcelas.map((p: any) => ({ cliente: pm[p.projeto_id], descricao: p.descricao, valor: Number(p.valor_esperado) })),
    prazos_de_entrega: (prazosRes.data || []).map((p: any) => ({ cliente: p.cliente, servico: p.servico })),
    soma_a_receber: parcelas.reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0),
  });
}

async function toolProximasEntregas(dias: any): Promise<string> {
  const d = Math.min(Math.max(Number(dias || 14), 1), 90);
  const hoje = new Date().toISOString().slice(0, 10);
  const lim = new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
  const { data } = await supa.from('projetos')
    .select('cliente, servico, status_fase, data_prazo_entrega, data_entrega_real, mensal')
    .gte('data_prazo_entrega', hoje).lte('data_prazo_entrega', lim).is('data_entrega_real', null)
    .order('data_prazo_entrega', { ascending: true });
  return JSON.stringify({
    janela_dias: d,
    total: (data || []).length,
    entregas: (data || []).map((p: any) => ({
      cliente: p.cliente,
      servico: p.servico,
      prazo: p.data_prazo_entrega,
      dias_restantes: Math.floor((new Date(p.data_prazo_entrega).getTime() - Date.now()) / 86400000),
      mensal_que_destrava: Number(p.mensal || 0),
    })),
  });
}

async function toolOqueFaltaNoProjeto(termo: string): Promise<string> {
  if (!termo) return 'Informe o cliente ou projeto.';
  const { data: projs } = await supa.from('projetos')
    .select('id, cliente, servico, status_fase, mensal, implementacao, data_inicio, data_prazo_entrega, data_entrega_real, escopo')
    .or(`cliente.ilike.%${termo}%,servico.ilike.%${termo}%`).limit(3);
  if (!projs || projs.length === 0) return 'Não achei projeto pra "' + termo + '".';
  const out: any[] = [];
  for (const p of projs) {
    const hoje = new Date().toISOString().slice(0, 10);
    const { data: pcs } = await supa.from('projeto_parcelas').select('valor_esperado, pago, data_vencimento_esperada, descricao').eq('projeto_id', p.id);
    const pendentes = (pcs || []).filter((x: any) => !x.pago);
    const atrasadas = pendentes.filter((x: any) => x.data_vencimento_esperada < hoje);
    const { data: cks } = await supa.from('project_checkpoints').select('titulo, done, ordem').ilike('cliente_nome', '%' + p.cliente + '%').order('ordem');
    out.push({
      projeto: p.cliente + ' / ' + p.servico,
      fase: p.status_fase,
      mensal: Number(p.mensal || 0),
      prazo_entrega: p.data_prazo_entrega,
      data_entrega: p.data_entrega_real,
      dias_para_entrega: p.data_prazo_entrega ? Math.floor((new Date(p.data_prazo_entrega).getTime() - Date.now()) / 86400000) : null,
      parcelas_pendentes: pendentes.length,
      parcelas_atrasadas: atrasadas.length,
      valor_atrasado: atrasadas.reduce((s: number, x: any) => s + Number(x.valor_esperado || 0), 0),
      checkpoints_total: (cks || []).length,
      checkpoints_feitos: (cks || []).filter((c: any) => c.done).length,
      checkpoints_pendentes: (cks || []).filter((c: any) => !c.done).slice(0, 5).map((c: any) => c.titulo),
      observacoes: (p.escopo || '').slice(-400) || null,
    });
  }
  return JSON.stringify(out);
}

// ════════════════════════════════════════════════════════════════════
// AÇÕES (etapa D — escrita sem confirmação)
// ════════════════════════════════════════════════════════════════════

async function toolMarcarParcelaPaga(cliente: string, valor: number, data_pagamento: any): Promise<string> {
  if (!cliente || !valor) return 'Preciso de cliente e valor pra marcar parcela paga.';
  const hoje = new Date().toISOString().slice(0, 10);
  const data = (!data_pagamento || data_pagamento === 'today') ? hoje : String(data_pagamento);
  const { data: cls } = await supa.from('clientes').select('id, nome').ilike('nome', '%' + cliente + '%').limit(1);
  if (!cls || cls.length === 0) return 'Cliente "' + cliente + '" não encontrado.';
  const cl = cls[0];
  const { data: projs } = await supa.from('projetos').select('id').eq('cliente_id', cl.id);
  const projIds = (projs || []).map((p: any) => p.id);
  if (projIds.length === 0) return 'Nenhum projeto cadastrado pra "' + cl.nome + '".';
  // Busca a parcela pendente mais próxima do valor
  const { data: pcs } = await supa.from('projeto_parcelas').select('id, valor_esperado, descricao, data_vencimento_esperada')
    .in('projeto_id', projIds as any).eq('pago', false).order('data_vencimento_esperada', { ascending: true });
  if (!pcs || pcs.length === 0) return 'Nenhuma parcela pendente pra "' + cl.nome + '".';
  // Acha a com valor mais próximo do informado
  const parc = (pcs as any[]).sort((a, b) => Math.abs(Number(a.valor_esperado) - valor) - Math.abs(Number(b.valor_esperado) - valor))[0];
  const { error } = await supa.from('projeto_parcelas').update({
    pago: true, valor_recebido: valor, data_pagamento: data,
    observacao: 'Marcado como pago via Copiloto WhatsApp em ' + new Date().toISOString(),
  }).eq('id', parc.id);
  if (error) return 'Erro ao marcar: ' + error.message;
  return JSON.stringify({ ok: true, cliente: cl.nome, parcela: parc.descricao, valor_esperado: Number(parc.valor_esperado), valor_recebido: valor, data });
}

async function toolEnviarMsgCliente(cliente: string, texto: string, instOrigem: any): Promise<string> {
  if (!cliente || !texto) return 'Preciso de cliente e texto.';
  // Tenta achar número: se já é número, usa direto; senão procura nos contatos
  let numero = cliente.replace(/\D/g, '');
  if (numero.length < 8) {
    // Buscar contato pelo nome
    const { data: ct } = await supa.from('wa_contatos').select('phone, saved_name, push_name')
      .or(`saved_name.ilike.%${cliente}%,push_name.ilike.%${cliente}%`).limit(1);
    if (!ct || ct.length === 0) return 'Contato "' + cliente + '" não encontrado.';
    numero = (ct[0].phone || '').replace(/\D/g, '');
  }
  if (!numero) return 'Não consegui resolver o número do contato.';
  try {
    await enviarMensagemEvolution(instOrigem, numero, texto);
    return JSON.stringify({ ok: true, enviado_para: numero, texto_preview: texto.slice(0, 100) });
  } catch (e) {
    return 'Erro ao enviar: ' + String(e).slice(0, 150);
  }
}

async function toolCriarLembrete(descricao: string, data: string, instancia_id: string, chat_jid: string): Promise<string> {
  if (!descricao || !data) return 'Preciso de descrição e data.';
  // Parser simples: aceita "YYYY-MM-DD HH:MM" ou "amanhã 9h", "dia 25 10h", etc
  let dt: Date | null = null;
  const m = String(data).match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/);
  if (m) {
    const [, y, mo, d, h, mi] = m;
    dt = new Date(Number(y), Number(mo) - 1, Number(d), Number(h || 9), Number(mi || 0));
  } else {
    const low = String(data).toLowerCase();
    const hMatch = low.match(/(\d{1,2})\s*(?:h|:|hr|horas?)/);
    const hr = hMatch ? Number(hMatch[1]) : 9;
    if (low.includes('amanha') || low.includes('amanhã')) {
      dt = new Date(Date.now() + 86400000);
      dt.setHours(hr, 0, 0, 0);
    } else if (low.includes('hoje')) {
      dt = new Date(); dt.setHours(hr, 0, 0, 0);
    } else {
      const diaMatch = low.match(/dia\s*(\d{1,2})/);
      if (diaMatch) {
        dt = new Date();
        dt.setDate(Number(diaMatch[1]));
        dt.setHours(hr, 0, 0, 0);
        if (dt.getTime() < Date.now()) dt.setMonth(dt.getMonth() + 1);
      }
    }
  }
  if (!dt) return 'Não consegui interpretar a data "' + data + '". Usa YYYY-MM-DD HH:MM, "amanhã 9h" ou "dia 25 10h".';
  const { data: ins, error } = await supa.from('copiloto_lembretes').insert({
    instancia_id, chat_jid, descricao, data_lembrete: dt.toISOString(), created_by_jid: chat_jid,
  }).select('id').single();
  if (error) return 'Erro ao criar lembrete: ' + error.message;
  return JSON.stringify({ ok: true, id: ins?.id, descricao, agendado_para: dt.toISOString() });
}

// ════════════════════════════════════════════════════════════════════
// ACESSO DIRETO AO BANCO (camada 1)
// ════════════════════════════════════════════════════════════════════

async function toolExecutarSql(query: string, max_rows: any, ctx: { record: any, inst: any }): Promise<string> {
  if (!query || !query.trim()) return JSON.stringify({ ok: false, erro: 'Query vazia.' });
  const lim = Math.min(Math.max(Number(max_rows || 100), 1), 1000);
  // tira ponto-e-vírgula final se vier
  const q = query.trim().replace(/;+\s*$/, '');
  const contexto = {
    fonte: 'copilot_wa',
    chat_jid: ctx.record?.chat_jid || null,
    message_id: ctx.record?.message_id || null,
    texto_original: (ctx.record?.text || '').slice(0, 300),
  };
  const { data, error } = await supa.rpc('copiloto_exec_sql', {
    p_query: q,
    p_max_rows: lim,
    p_chat_jid: ctx.record?.chat_jid || null,
    p_instancia_id: ctx.record?.instancia_id || null,
    p_contexto: contexto,
  });
  if (error) return JSON.stringify({ ok: false, erro: error.message });
  // data já vem como JSONB com { ok, ... }
  return JSON.stringify(data);
}

async function executarToolCopiloto(name: string, input: any, ctx: { record: any, inst: any }): Promise<string> {
  try {
    // Leitura geral
    if (name === 'resumo_negocio') return await toolResumoNegocio();
    if (name === 'buscar_cliente') return await toolBuscarCliente(input?.termo);
    if (name === 'conversas_recentes') return await toolConversasRecentes(input?.limite);
    if (name === 'metricas_whatsapp') return await toolMetricasWhatsapp(input?.dias);
    // Leitura financeira
    if (name === 'fluxo_caixa') return await toolFluxoCaixa();
    if (name === 'parcelas_atrasadas') return await toolParcelasAtrasadas(input?.limite);
    if (name === 'pagamentos_recentes') return await toolPagamentosRecentes(input?.dias);
    if (name === 'consultar_cliente_financeiro') return await toolConsultarClienteFinanceiro(input?.termo);
    if (name === 'previsao_recebimento') return await toolPrevisaoRecebimento(input?.data_inicio, input?.data_fim);
    // Leitura operacional
    if (name === 'pipeline_propostas') return await toolPipelinePropostas();
    if (name === 'projetos_em_implantacao') return await toolProjetosEmImplantacao();
    if (name === 'checkpoints_pendentes') return await toolCheckpointsPendentes(input?.cliente);
    if (name === 'agenda_hoje') return await toolAgendaHoje();
    if (name === 'proximas_entregas') return await toolProximasEntregas(input?.dias);
    if (name === 'o_que_falta_no_projeto') return await toolOqueFaltaNoProjeto(input?.termo);
    // Ações
    if (name === 'marcar_parcela_paga') return await toolMarcarParcelaPaga(input?.cliente, Number(input?.valor), input?.data_pagamento);
    if (name === 'enviar_msg_cliente') return await toolEnviarMsgCliente(input?.cliente, input?.texto, ctx.inst);
    if (name === 'criar_lembrete') return await toolCriarLembrete(input?.descricao, input?.data, ctx.record.instancia_id, ctx.record.chat_jid);
    // Acesso direto ao banco
    if (name === 'executar_sql') return await toolExecutarSql(input?.query, input?.max_rows, ctx);
    return 'Ferramenta desconhecida: ' + name;
  } catch (e) {
    return 'Erro ao executar ' + name + ': ' + String(e).slice(0, 150);
  }
}

// Loop de tool-use (Claude Opus 4.8). Sem thinking pra simplificar o loop;
// o prompt pede resposta final apenas. Máx 8 iterações de ferramenta.
async function chamarClaudeTools(system: string, messages: any[], ctx: { record: any, inst: any }): Promise<string> {
  const msgs: any[] = [...messages];
  for (let i = 0; i < 8; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, system, tools: COPILOTO_TOOLS, messages: msgs }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    if (data.stop_reason === 'tool_use') {
      const toolResults: any[] = [];
      for (const block of (data.content || [])) {
        if (block.type === 'tool_use') {
          const result = await executarToolCopiloto(block.name, block.input, ctx);
          toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: result });
        }
      }
      msgs.push({ role: 'assistant', content: data.content });
      msgs.push({ role: 'user', content: toolResults });
      continue;
    }
    return ((data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n')).trim();
  }
  return 'Demorei demais processando isso. Tenta perguntar de um jeito mais simples?';
}

async function processarCopiloto(record: any, inst: any, desdeTs: string | null) {
  const chatJid = record.chat_jid;
  const numero = chatJid.replace('@s.whatsapp.net', '').replace('@c.us', '');
  try {
    await enviarPresencaDigitando(inst, numero, 12000);

    // Debounce: aguarda 1.5s e cancela se chegou msg mais nova (evita processar 2x quando user manda rajada)
    await new Promise(r => setTimeout(r, 1500));
    const { data: maisNovas } = await supa.from('wa_mensagens')
      .select('id').eq('instancia_id', record.instancia_id).eq('chat_jid', chatJid)
      .eq('from_me', false).gt('timestamp', record.timestamp).limit(1);
    if (maisNovas && maisNovas.length > 0) return;

    // Histórico: últimas 24h (memória curta entre sessões) OU desde a ativação,
    // o que for MAIS RECENTE. Garante contexto contínuo do dia sem voltar pro tom
    // antigo do agente cliente que possa ter morado no chat.
    const limite24h = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const desdeFinal = desdeTs && desdeTs > limite24h ? desdeTs : limite24h;
    let q = supa.from('wa_mensagens')
      .select('from_me, text, timestamp')
      .eq('instancia_id', record.instancia_id)
      .eq('chat_jid', chatJid)
      .gt('timestamp', desdeFinal);
    const { data: msgs } = await q.order('timestamp', { ascending: false }).limit(50);
    const ordenadas = (msgs || []).reverse();
    const raw = ordenadas
      .filter((m: any) => m.text && m.text.trim().length > 0)
      .filter((m: any) => !/brava\s*copilot/i.test(m.text || ''))   // tira o comando de ativação do histórico
      .map((m: any) => ({ role: m.from_me ? 'assistant' : 'user', content: m.text }));
    const history: Array<{ role: string, content: any }> = [];
    for (const m of raw) {
      if (history.length > 0 && history[history.length - 1].role === m.role) {
        history[history.length - 1].content += '\n' + m.content;
      } else {
        history.push({ ...m });
      }
    }
    while (history.length > 0 && history[0].role !== 'user') history.shift();
    if (history.length === 0 || history[history.length - 1].role !== 'user') {
      history.push({ role: 'user', content: record.text || '' });
    }

    const resposta = await chamarClaudeTools(COPILOTO_PROMPT + HUMANIZACAO_INSTRUCTION, history, { record, inst });
    if (!resposta) return;

    const enviado = await enviarMensagemEvolution(inst, numero, resposta);
    const newId = enviado?.key?.id;
    await supa.from('wa_eventos_log').insert({
      instancia_id: record.instancia_id, event_type: 'copiloto.replied',
      payload: { chat_jid: chatJid, in_reply_to: record.message_id, response: resposta.slice(0, 400) },
      processed: true,
    });
    if (newId) {
      setTimeout(async () => {
        await supa.from('wa_mensagens').update({ ia_generated: true })
          .eq('instancia_id', record.instancia_id).eq('message_id', newId);
      }, 4000);
    }
  } catch (e) {
    const errStr = String(e);
    await supa.from('wa_eventos_log').insert({
      instancia_id: record.instancia_id, event_type: 'copiloto.error',
      payload: { chat_jid: chatJid, error: errStr },
      error: errStr,
    });
    // Mensagem amigável por tipo de erro (não vaza detalhe técnico cru pro WhatsApp)
    let msgErro = 'Opa, tive um problema técnico aqui. Tenta de novo em instantes.';
    const low = errStr.toLowerCase();
    if (low.includes('credit balance') || low.includes('insufficient') || (low.includes('400') && low.includes('billing'))) {
      msgErro = 'Estou sem crédito de IA no momento. É só recarregar em console.anthropic.com/settings/billing que eu volto a funcionar na hora.';
    } else if (low.includes('429') || low.includes('rate limit') || low.includes('overloaded')) {
      msgErro = 'A IA tá sobrecarregada nesse instante. Me manda de novo em alguns segundos.';
    } else if (low.includes('529')) {
      msgErro = 'O serviço de IA tá temporariamente indisponível. Tenta de novo já já.';
    }
    try { await enviarMensagemEvolution(inst, numero, msgErro); } catch { /* noop */ }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  // 🔒 Autentica o webhook antes de qualquer processamento ou acesso ao banco.
  const authErr = checarAutenticacaoWebhook(req);
  if (authErr) return authErr;

  let payload: any;
  try { payload = await req.json(); } catch { return json(400, { error: 'invalid_json' }); }

  const record = payload.record || payload;
  if (!record || !record.message_id) return json(200, { skipped: 'no_record' });

  if (record.from_me) return json(200, { skipped: 'from_me' });
  if (record.ia_generated) return json(200, { skipped: 'ia_loop' });
  if (record.kind !== 'text') return json(200, { skipped: 'not_text' });
  const chatJid = record.chat_jid;
  if (chatJid?.endsWith('@g.us')) return json(200, { skipped: 'group' });
  if (chatJid?.endsWith('@broadcast')) return json(200, { skipped: 'broadcast' });

  const { data: inst } = await supa.from('wa_instancias')
    .select('evolution_url, evolution_instance_name, evolution_apikey, ai_enabled_global, ai_model, ai_prompt, ai_typing_enabled, ai_thinking_seconds, ai_split_enabled')
    .eq('id', record.instancia_id).single();
  if (!inst) return json(404, { error: 'instancia_nao_encontrada' });

  // ✨ COPILOTO INTERNO (modo operador) — ativado por COMANDO, com sessão limpa.
  //    Só dispara pra remetentes do allowlist (BRAVA_OPERADOR_JIDS). Quando o
  //    operador NÃO ativou o copiloto, o agente de cliente NÃO responde pra ele.
  const operadores = (Deno.env.get('BRAVA_OPERADOR_JIDS') || '').split(',').map(s => s.replace(/\D/g, '')).filter(Boolean);
  const PIN = (Deno.env.get('BRAVA_COPILOT_PIN') || '').trim();
  const last8 = (n: string) => (n || '').replace(/\D/g, '').slice(-8);
  let senderNum = (chatJid || '').replace(/@.*$/, '').replace(/\D/g, '');
  // Resolve o número real via wa_contatos quando o jid é @lid (privacidade do WhatsApp novo)
  if (chatJid && chatJid.includes('@lid')) {
    const { data: ct } = await supa.from('wa_contatos')
      .select('phone, phone_jid').eq('instancia_id', record.instancia_id).eq('jid', chatJid).maybeSingle();
    const ph = ((ct?.phone || ct?.phone_jid || '') as string).replace(/\D/g, '');
    if (ph) senderNum = ph;
  }
  const isOperador = operadores.length > 0 && last8(senderNum).length >= 8 && operadores.some(o => last8(o) === last8(senderNum));

  if (isOperador) {
    const txt = String(record.text || '');
    const norm = txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const numeroEnvio = senderNum;
    const ehComandoAtivar = /\bbrava\s*copilot/.test(norm);
    const ehDesativar = /\b(brava sair|sair copilot|encerrar copilot|desativar copilot)\b/.test(norm);

    if (ehDesativar) {
      await supa.from('copiloto_estado').upsert(
        { instancia_id: record.instancia_id, chat_jid: chatJid, ativo: false, updated_at: new Date().toISOString() },
        { onConflict: 'instancia_id,chat_jid' });
      // @ts-ignore
      EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, 'Copiloto desativado. Pra voltar, envie *Brava Copilot* seguido do seu PIN.').catch(() => {}));
      return json(200, { ok: true, mode: 'copiloto_desativado' });
    }

    if (ehComandoAtivar) {
      // Fail-closed: sem PIN configurado, o copiloto NÃO pode ser ativado.
      if (!PIN) {
        console.error('[wa-ia-responder] BRAVA_COPILOT_PIN não configurado — ativação recusada.');
        // @ts-ignore
        EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, 'Copiloto indisponível: PIN não configurado. Fale com o administrador.').catch(() => {}));
        return json(200, { ok: true, mode: 'copiloto_indisponivel' });
      }
      // Throttle de tentativas por remetente (barreira contra brute force).
      if (!registrarTentativaPin(senderNum)) {
        // @ts-ignore
        EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.').catch(() => {}));
        return json(200, { ok: true, mode: 'copiloto_rate_limited' });
      }
      // Comparação EXATA do PIN (não mais substring), em tempo constante.
      // Extrai o que veio depois do comando "brava copilot".
      const mPin = txt.match(/brava\s*copilot[\s:]*(.*)$/is);
      const pinInformado = (mPin ? mPin[1] : '').trim();
      const pinOk = timingSafeEqual(pinInformado, PIN);
      if (!pinOk) {
        // @ts-ignore
        EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, 'PIN inválido. Envie *Brava Copilot* seguido do seu PIN.').catch(() => {}));
        return json(200, { ok: true, mode: 'copiloto_pin_invalido' });
      }
      limparTentativasPin(senderNum);
      const agora = new Date().toISOString();
      await supa.from('copiloto_estado').upsert(
        { instancia_id: record.instancia_id, chat_jid: chatJid, ativo: true, ativado_em: agora, updated_at: agora },
        { onConflict: 'instancia_id,chat_jid' });
      // @ts-ignore
      EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, '*Copiloto Brava ativado.*\n\nPode pedir: fluxo de caixa, atrasados, agenda de hoje, próximas entregas, cliente X, marcar parcela paga, criar lembrete, enviar mensagem pra alguém.\n\nPra encerrar: *Brava sair*.').catch(() => {}));
      return json(200, { ok: true, mode: 'copiloto_ativado' });
    }

    // Mensagem normal de operador: só responde se a sessão do copiloto estiver ativa
    const { data: est } = await supa.from('copiloto_estado')
      .select('ativo, ativado_em').eq('instancia_id', record.instancia_id).eq('chat_jid', chatJid).maybeSingle();
    if (est && est.ativo) {
      // Expira a sessão após a duração máxima → exige reativação com PIN.
      const ativadoMs = est.ativado_em ? Date.parse(est.ativado_em) : 0;
      if (!ativadoMs || (Date.now() - ativadoMs) > COPILOT_SESSION_TTL_MS) {
        await supa.from('copiloto_estado').upsert(
          { instancia_id: record.instancia_id, chat_jid: chatJid, ativo: false, updated_at: new Date().toISOString() },
          { onConflict: 'instancia_id,chat_jid' });
        // @ts-ignore
        EdgeRuntime.waitUntil(enviarMensagemEvolution(inst, numeroEnvio, 'Sua sessão do copiloto expirou. Envie *Brava Copilot* seguido do seu PIN pra reativar.').catch(() => {}));
        return json(200, { ok: true, mode: 'copiloto_sessao_expirada' });
      }
      // @ts-ignore
      EdgeRuntime.waitUntil(processarCopiloto(record, inst, est.ativado_em || null));
      return json(200, { ok: true, queued: true, mode: 'copiloto', message_id: record.message_id });
    }
    // Operador com copiloto desligado → silêncio (não responde como cliente).
    return json(200, { skipped: 'copiloto_inativo' });
  }

  if (inst.ai_enabled_global === false) return json(200, { skipped: 'ai_global_disabled' });

  const { data: chat } = await supa.from('wa_chats')
    .select('ai_enabled').eq('instancia_id', record.instancia_id).eq('jid', chatJid).maybeSingle();
  if (chat && chat.ai_enabled === false) return json(200, { skipped: 'ai_chat_disabled' });

  // @ts-ignore
  EdgeRuntime.waitUntil(processarResposta(record, inst));
  return json(200, { ok: true, queued: true, message_id: record.message_id });
});
