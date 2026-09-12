// wa-proxy — Proxy server-side para a Evolution API.
//
// Objetivo de seguranca: a apikey da Evolution NUNCA vai para o browser. O
// frontend chama esta funcao (autenticado com a sessao Supabase) passando apenas
// { instancia_id, path, method, body }; a funcao resolve a URL + apikey da
// instancia na tabela wa_instancias (com service_role) e encaminha para a
// Evolution, devolvendo a resposta.
//
// Contrato esperado pelo frontend (admin/index.html -> supaProxyCall):
//   POST /functions/v1/wa-proxy
//   headers: { apikey, authorization: Bearer <jwt da sessao> }
//   body: { instancia_id, path, method?, body? }
//   - `path` pode conter o placeholder {{instance}}, substituido pelo
//     evolution_instance_name da instancia (ex: /message/sendText/{{instance}}).
//
// Env vars necessarias: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const SUPA_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const admin = createClient(SUPA_URL, SUPA_SERVICE, { auth: { persistSession: false } });

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json' } });

// Extrai o JWT do header Authorization.
function extrairJwt(req: Request): string {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}

// Paths permitidos (allowlist). Evita que a funcao vire proxy aberto para
// qualquer endpoint da Evolution. Ajuste conforme necessario.
const PATH_ALLOWLIST = [
  /^\/message\/sendText\//,
  /^\/message\/sendMedia\//,
  /^\/message\/sendWhatsAppAudio\//,
  /^\/chat\/findChats\//,
  /^\/chat\/findMessages\//,
  /^\/chat\/findContacts\//,
  /^\/chat\/fetchProfilePictureUrl\//,
  /^\/chat\/whatsappNumbers\//,
  /^\/chat\/getBase64FromMediaMessage\//,
];
function pathPermitido(path: string): boolean {
  return PATH_ALLOWLIST.some((re) => re.test(path));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  // 1) Exige um usuario autenticado (JWT da sessao Supabase). Sem sessao valida,
  //    ninguem consegue usar o proxy (a apikey fica protegida).
  const jwt = extrairJwt(req);
  if (!jwt) return json(401, { error: 'missing_authorization' });
  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userData?.user) return json(401, { error: 'unauthorized' });

  // 2) Payload
  let payload: any;
  try { payload = await req.json(); } catch { return json(400, { error: 'invalid_json' }); }
  const { instancia_id, path, method = 'GET', body } = payload || {};
  if (!instancia_id) return json(400, { error: 'missing_instancia_id' });
  if (!path || typeof path !== 'string') return json(400, { error: 'missing_path' });

  // 3) Resolve a instancia (url + instance_name + apikey) com service_role.
  const { data: inst, error: instErr } = await admin.from('wa_instancias')
    .select('evolution_url, evolution_instance_name, evolution_apikey, workspace_id')
    .eq('id', instancia_id).single();
  if (instErr || !inst) return json(404, { error: 'instancia_nao_encontrada' });

  // 3b) (Recomendado) Escopo por workspace: garante que o usuario pertence ao
  //     workspace da instancia. Habilite depois de confirmar o schema de
  //     workspace_members. Enquanto desabilitado, qualquer usuario autenticado
  //     pode operar qualquer instancia.
  // const { data: membro } = await admin.from('workspace_members')
  //   .select('workspace_id').eq('user_id', userData.user.id)
  //   .eq('workspace_id', inst.workspace_id).maybeSingle();
  // if (!membro) return json(403, { error: 'forbidden_workspace' });

  // 4) Monta a URL final. Substitui {{instance}} pelo nome da instancia.
  const instanceName = inst.evolution_instance_name || '';
  const finalPath = path.replace(/\{\{instance\}\}/g, encodeURIComponent(instanceName));
  if (!pathPermitido(finalPath)) return json(403, { error: 'path_nao_permitido', path: finalPath });
  const base = String(inst.evolution_url || '').replace(/\/+$/, '');
  if (!base) return json(500, { error: 'instancia_sem_url' });
  const url = base + finalPath;

  // 5) Encaminha para a Evolution com a apikey (server-side).
  const m = String(method || 'GET').toUpperCase();
  const init: RequestInit = {
    method: m,
    headers: { 'content-type': 'application/json', 'apikey': inst.evolution_apikey || '' },
  };
  if (m !== 'GET' && m !== 'HEAD' && body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const resp = await fetch(url, init);
    const text = await resp.text();
    // Repassa o corpo cru da Evolution, preservando o status.
    return new Response(text, {
      status: resp.status,
      headers: { ...cors, 'content-type': resp.headers.get('content-type') || 'application/json' },
    });
  } catch (e) {
    return json(502, { error: 'evolution_unreachable', detail: String(e).slice(0, 200) });
  }
});
