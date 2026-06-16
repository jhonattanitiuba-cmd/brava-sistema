// Briefing matinal do Copiloto Brava (07h BRT).
// Roda via cron pg_cron. Coleta panorama do dia e envia pro Jhonattan via instância Brava Principal.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const SUPA_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

const cors = { 'access-control-allow-origin': '*' };
const json = (s: number, b: unknown) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } });

function fmtBRL(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDDMM(iso: string): string {
  const [, m, d] = iso.match(/^(\d{4})-(\d{2})-(\d{2})/) || [];
  return d && m ? `${d}/${m}` : iso;
}

async function montarBriefing(): Promise<string> {
  const hoje = new Date().toISOString().slice(0, 10);
  const t = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

  // Vencimentos do dia
  const { data: parcelasHoje } = await supa.from('projeto_parcelas')
    .select('valor_esperado, descricao, projeto_id').eq('pago', false).eq('data_vencimento_esperada', hoje);
  // Entregas do dia
  const { data: entregasHoje } = await supa.from('projetos')
    .select('cliente, servico').eq('data_prazo_entrega', hoje).is('data_entrega_real', null);
  // Atrasados
  const { data: atrasadas } = await supa.from('projeto_parcelas')
    .select('valor_esperado, descricao, projeto_id, data_vencimento_esperada').eq('pago', false).lt('data_vencimento_esperada', hoje);
  // Previsto próximos 7 dias
  const { data: prox7 } = await supa.from('projeto_parcelas')
    .select('valor_esperado, descricao, projeto_id, data_vencimento_esperada')
    .eq('pago', false).gte('data_vencimento_esperada', hoje).lte('data_vencimento_esperada', t(7));
  // Previsto 30d
  const { data: prox30 } = await supa.from('projeto_parcelas')
    .select('valor_esperado').eq('pago', false).gte('data_vencimento_esperada', hoje).lte('data_vencimento_esperada', t(30));
  // Conversas não-lidas
  const { count: naoLidasCount } = await supa.from('wa_chats').select('*', { count: 'exact', head: true })
    .gt('unread_count', 0);

  // Cruzar parcelas com projetos pra pegar cliente
  const allParcelaProjIds = [...new Set([...(parcelasHoje || []), ...(atrasadas || []), ...(prox7 || [])].map((p: any) => p.projeto_id))];
  const { data: projs } = await supa.from('projetos').select('id, cliente').in('id', allParcelaProjIds as any);
  const pm: Record<string, string> = {};
  (projs || []).forEach((p: any) => { pm[p.id] = p.cliente; });

  const sumar = (arr: any[] | null) => (arr || []).reduce((s: number, p: any) => s + Number(p.valor_esperado || 0), 0);

  // Monta texto
  const linhas: string[] = [];
  linhas.push('*BRAVA · Briefing Matinal*');
  linhas.push(new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }));
  linhas.push('');

  // Bloco 1: hoje
  if ((parcelasHoje?.length || 0) > 0 || (entregasHoje?.length || 0) > 0) {
    linhas.push('*Para hoje*');
    if (parcelasHoje && parcelasHoje.length > 0) {
      linhas.push(`Recebíveis previstos: *${fmtBRL(sumar(parcelasHoje))}* em ${parcelasHoje.length} parcela${parcelasHoje.length > 1 ? 's' : ''}.`);
      parcelasHoje.slice(0, 5).forEach((p: any) => {
        linhas.push(`• ${pm[p.projeto_id] || '?'}: ${fmtBRL(Number(p.valor_esperado))}${p.descricao ? ' (' + p.descricao + ')' : ''}`);
      });
    }
    if (entregasHoje && entregasHoje.length > 0) {
      linhas.push(`Entregas previstas: *${entregasHoje.length}*`);
      entregasHoje.forEach((p: any) => linhas.push(`• ${p.cliente}: ${p.servico}`));
    }
    linhas.push('');
  } else {
    linhas.push('*Para hoje*');
    linhas.push('Nenhum vencimento ou entrega previstos.');
    linhas.push('');
  }

  // Bloco 2: atrasados
  if (atrasadas && atrasadas.length > 0) {
    linhas.push(`*Atrasados* (${atrasadas.length} parcelas, *${fmtBRL(sumar(atrasadas))}*)`);
    atrasadas.slice(0, 5).forEach((p: any) => {
      const dias = Math.floor((Date.now() - new Date(p.data_vencimento_esperada).getTime()) / 86400000);
      linhas.push(`• ${pm[p.projeto_id] || '?'}: ${fmtBRL(Number(p.valor_esperado))} (${dias} dias)`);
    });
    if (atrasadas.length > 5) linhas.push(`...e mais ${atrasadas.length - 5}.`);
    linhas.push('');
  }

  // Bloco 3: próximos 7 dias
  if (prox7 && prox7.length > 0) {
    linhas.push(`*Próximos 7 dias*: ${fmtBRL(sumar(prox7))} em ${prox7.length} parcelas.`);
    const porDia: Record<string, number> = {};
    prox7.forEach((p: any) => {
      porDia[p.data_vencimento_esperada] = (porDia[p.data_vencimento_esperada] || 0) + Number(p.valor_esperado);
    });
    Object.entries(porDia).sort((a, b) => a[0].localeCompare(b[0])).slice(0, 5).forEach(([d, v]) => {
      linhas.push(`• ${fmtDDMM(d)}: ${fmtBRL(v)}`);
    });
    linhas.push('');
  }

  // Bloco 4: panorama 30d
  linhas.push(`*Panorama 30 dias*: *${fmtBRL(sumar(prox30))}* previstos.`);
  if (naoLidasCount && naoLidasCount > 0) {
    linhas.push(`Você tem *${naoLidasCount}* conversa${naoLidasCount > 1 ? 's' : ''} no WhatsApp não lida${naoLidasCount > 1 ? 's' : ''}.`);
  }
  linhas.push('');
  linhas.push('Equipe Brava');

  return linhas.join('\n');
}

async function enviarParaJhonattan(texto: string) {
  const operadores = (Deno.env.get('BRAVA_OPERADOR_JIDS') || '5511991612610').split(',').map(s => s.replace(/\D/g, '')).filter(Boolean);
  if (operadores.length === 0) throw new Error('BRAVA_OPERADOR_JIDS vazio');
  // Pega a instância Brava Principal (SistemaBravaCompany) — NÃO usa instância do próprio operador
  // pra evitar 401 do Evolution quando o número é o mesmo que enviaria/receberia.
  const last8 = (n: string) => (n || '').replace(/\D/g, '').slice(-8);
  const { data: insts } = await supa.from('wa_instancias').select('*').eq('status', 'open');
  if (!insts || insts.length === 0) throw new Error('Nenhuma instância open');
  // Prioridade: 1) SistemaBravaCompany 2) qualquer instância que NÃO seja do operador 3) primeira
  let inst: any = insts.find((i: any) => i.evolution_instance_name === 'SistemaBravaCompany');
  if (!inst) {
    inst = insts.find((i: any) => !operadores.some(o => last8(i.owner_jid || '') === last8(o)));
  }
  if (!inst) inst = insts[0];
  const url = inst.evolution_url.replace(/\/+$/, '') + `/message/sendText/${encodeURIComponent(inst.evolution_instance_name)}`;
  const results: any[] = [];
  for (const num of operadores) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: inst.evolution_apikey },
        body: JSON.stringify({ number: num, text: texto }),
      });
      results.push({ num, status: res.status });
    } catch (e) {
      results.push({ num, error: String(e).slice(0, 100) });
    }
  }
  return { instancia: inst.evolution_instance_name, results };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST' && req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
  try {
    const texto = await montarBriefing();
    const env = await enviarParaJhonattan(texto);
    await supa.from('wa_eventos_log').insert({
      event_type: 'briefing.enviado',
      payload: { preview: texto.slice(0, 500), destinatarios: env.results, instancia: env.instancia },
      processed: true,
    });
    return json(200, { ok: true, instancia: env.instancia, destinatarios: env.results });
  } catch (e) {
    await supa.from('wa_eventos_log').insert({ event_type: 'briefing.erro', payload: {}, error: String(e).slice(0, 500) });
    return json(500, { error: String(e) });
  }
});
