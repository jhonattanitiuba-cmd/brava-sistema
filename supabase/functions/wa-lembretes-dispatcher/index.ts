// Dispatcher de lembretes do Copiloto Brava.
// Roda em cron (a cada 5 min). Busca lembretes pendentes com data <= NOW() e envia via Evolution.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const SUPA_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supa = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

const cors = { 'access-control-allow-origin': '*' };
const json = (s: number, b: unknown) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'content-type': 'application/json' } });

async function processar(): Promise<{ enviados: number, erros: number, detalhes: any[] }> {
  const agora = new Date().toISOString();
  const { data: lembretes } = await supa.from('copiloto_lembretes')
    .select('id, instancia_id, chat_jid, descricao, data_lembrete')
    .eq('enviado', false).lte('data_lembrete', agora).limit(30);

  if (!lembretes || lembretes.length === 0) return { enviados: 0, erros: 0, detalhes: [] };

  let enviados = 0, erros = 0;
  const detalhes: any[] = [];

  for (const l of lembretes) {
    try {
      const { data: inst } = await supa.from('wa_instancias')
        .select('evolution_url, evolution_instance_name, evolution_apikey')
        .eq('id', l.instancia_id).single();
      if (!inst) { erros++; detalhes.push({ id: l.id, erro: 'instancia_nao_encontrada' }); continue; }

      const numero = l.chat_jid.replace(/@.*$/, '');
      const texto = `*Lembrete Copiloto Brava*\n\n${l.descricao}\n\n_Agendado para ${new Date(l.data_lembrete).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}_`;
      const url = inst.evolution_url.replace(/\/+$/, '') + `/message/sendText/${encodeURIComponent(inst.evolution_instance_name)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: inst.evolution_apikey },
        body: JSON.stringify({ number: numero, text: texto }),
      });

      if (res.ok) {
        await supa.from('copiloto_lembretes').update({ enviado: true, enviado_em: new Date().toISOString() }).eq('id', l.id);
        enviados++;
        detalhes.push({ id: l.id, ok: true });
      } else {
        erros++;
        detalhes.push({ id: l.id, erro: 'evolution_' + res.status });
      }
    } catch (e) {
      erros++;
      detalhes.push({ id: l.id, erro: String(e).slice(0, 100) });
    }
  }

  await supa.from('wa_eventos_log').insert({
    event_type: 'lembretes.dispatched',
    payload: { enviados, erros, total: lembretes.length },
    processed: true,
  });
  return { enviados, erros, detalhes };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST' && req.method !== 'GET') return json(405, { error: 'method_not_allowed' });
  try {
    const r = await processar();
    return json(200, { ok: true, ...r });
  } catch (e) {
    return json(500, { error: String(e) });
  }
});
