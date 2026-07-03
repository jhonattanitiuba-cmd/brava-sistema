// gerar-proposta: monta uma proposta comercial da Brava a partir de uma
// transcrição de reunião/ligação, no modelo usado pelo admin (Propostas).
// Retorna { ok:true, proposta:{...} } para o front abrir o editor já preenchido.
// Deploy: supabase functions deploy gerar-proposta --project-ref buvduumggjpybhzbdqzm
// Secret necessário no projeto: ANTHROPIC_API_KEY.

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': '*',
};
const json = (s: number, b: unknown) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } });

async function chamarClaude(system: string, user: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

const SYSTEM = `Você é o assistente comercial da Brava Company. A partir de uma transcrição de reunião/ligação, você monta uma PROPOSTA COMERCIAL da Brava no padrão da empresa.

RESPONDA SOMENTE COM UM JSON válido (sem texto antes ou depois, sem cercas de código), no formato exato:
{
  "cliente": "razão social / nome do cliente (se aparecer na transcrição, senão vazio)",
  "cnpj": "",
  "endereco": "endereço se citado, senão vazio",
  "aosCuidados": "a quem a proposta é dirigida (ex.: nome dos sócios), senão vazio",
  "repLegal": "quem assina pelo cliente, senão vazio",
  "capaTitulo": "título curto da capa (ex.: Plataforma Automatizada, Parceria de Gestão e Tecnologia)",
  "subtitulo": "subtítulo curto da capa",
  "plano": "Performance | Scale | Enterprise (infira pelo escopo; se não souber, Performance)",
  "validadeDias": "7",
  "agenteNome": "nome do agente de IA (ex.: IA <Cliente>)",
  "mapeamento": "Diagnóstico: a dor/contexto mapeado na reunião, em 1 parágrafo consultivo",
  "escopoProjeto": "o que a plataforma/serviço entrega, em 1 parágrafo",
  "objetivo": "o objetivo do projeto, em 1 parágrafo",
  "resultados": ["resultado 1", "resultado 2", "..."],
  "planoAcao": ["passo 1", "passo 2", "..."],
  "etapas": [{ "etapa": "1", "cronograma": "1ª semana", "realizacao": ["item", "item"] }],
  "investimento": { "setup": "", "setupDescPct": "", "mensal": "", "minMeses": "", "prazoDias": "30", "formasSetup": "", "formasMensal": "Boleto ou Pix, mensal com data fixa" },
  "fluxoFrentes": ["frente 1", "frente 2"],
  "fluxoLanes": [{ "titulo": "Frente", "passos": [{ "tipo": "auto", "t": "título curto", "s": "subtítulo" }, { "tipo": "transfer", "t": "handoff" }, { "tipo": "humano", "t": "título", "s": "subtítulo" }] }],
  "investDistribuicao": [{ "grupo": "Infraestrutura tecnológica", "item": "descrição", "valor": 0 }],
  "evolucao": "próximos passos / fase 2, se fizer sentido, senão vazio",
  "fechamento": "parágrafo de fechamento dirigido ao cliente",
  "foro": "cidade/UF do foro se citada, senão vazio"
}

REGRAS IMPORTANTES:
- Escreva em português do Brasil, tom leve, claro e profissional, consultivo.
- NÃO use travessões (—). Use dois-pontos, vírgula, ponto ou parênteses.
- Explique termos técnicos entre aspas na primeira vez (ex.: "CRM" (sistema que organiza seus clientes)).
- NÃO INVENTE valores nem CNPJ. Se um valor (mensal, setup, minMeses) não foi dito na transcrição, deixe a string vazia. Se a soma da distribuição não bater, ajuste para bater com o mensal; se não houver valores, deixe investDistribuicao como [].
- "tipo" em fluxoLanes só pode ser "auto" (preto, automático IA/sistema), "humano" (branco, equipe do cliente) ou "transfer" (ponto de transferência, use só o campo t).
- Valores monetários em "investimento" são strings numéricas sem símbolo (ex.: "2497"); "valor" em investDistribuicao é número.
- Preencha somente com o que a transcrição sustentar; o que não aparecer, deixe vazio ou como lista curta e genérica coerente com o escopo. O usuário revisa depois.`;

function extrairJSON(txt: string): unknown {
  const i = txt.indexOf('{');
  const j = txt.lastIndexOf('}');
  if (i < 0 || j < 0 || j <= i) throw new Error('resposta_sem_json');
  return JSON.parse(txt.slice(i, j + 1));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  if (!ANTHROPIC_KEY) return json(500, { ok: false, error: 'sem_chave_anthropic' });
  let body: { transcricao?: string; cliente_nome?: string };
  try { body = await req.json(); } catch { return json(400, { ok: false, error: 'body_invalido' }); }
  const transcricao = (body.transcricao || '').trim();
  const clienteNome = (body.cliente_nome || '').trim();
  if (transcricao.length < 10) return json(400, { ok: false, error: 'transcricao_curta' });

  const user =
    (clienteNome ? `Cliente informado: ${clienteNome}\n\n` : '') +
    `Transcrição:\n"""\n${transcricao.slice(0, 24000)}\n"""`;

  try {
    const txt = await chamarClaude(SYSTEM, user);
    const proposta = extrairJSON(txt);
    if (!proposta || typeof proposta !== 'object' || Array.isArray(proposta)) {
      return json(502, { ok: false, error: 'json_invalido' });
    }
    if (clienteNome && !(proposta as Record<string, unknown>).cliente) {
      (proposta as Record<string, unknown>).cliente = clienteNome;
    }
    return json(200, { ok: true, proposta });
  } catch (e) {
    return json(502, { ok: false, error: String((e as Error).message || e) });
  }
});
