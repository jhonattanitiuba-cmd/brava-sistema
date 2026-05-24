// ═══════════════════════════════════════════════════════════
// EVO ADMIN CLIENT - chama Edge Function wa-instance-admin
// ═══════════════════════════════════════════════════════════
// Wrapper pro front cliente (app/onboarding) usar a master key
// da Evolution server-side via Edge Function.
//
// Uso:
//   const data = await window.evoAdmin.create('JhonattanItiuba', BRAVA_TEMPLATE);
//   const state = await window.evoAdmin.state('JhonattanItiuba');
//   ...
// ═══════════════════════════════════════════════════════════

(function () {
  const SUPA_URL = 'https://buvduumggjpybhzbdqzm.supabase.co';
  const SUPA_KEY = 'sb_publishable_j4V4fiVSYHgMS4fu_RnScw_vZOr0KBT';

  async function call(action, instanceName, payload) {
    const res = await fetch(`${SUPA_URL}/functions/v1/wa-instance-admin`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'apikey': SUPA_KEY,
      },
      body: JSON.stringify({ action, instanceName, payload }),
    });
    const text = await res.text();
    let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || text || `HTTP ${res.status}`;
      const e = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      e.status = res.status; e.data = data;
      throw e;
    }
    return data;
  }

  // Template padrão Brava - webhook (com token de validação) + settings idênticos
  // a Brava Principal em produção. Aplicar em toda nova instância pra garantir
  // espelhamento completo via wa-webhook Edge Function.
  window.BRAVA_INSTANCE_TEMPLATE = {
    webhook: {
      enabled: true,
      url: `${SUPA_URL}/functions/v1/wa-webhook?token=brava_wh_a7k9m2x5q8z3p1`,
      byEvents: false,
      base64: false,
      events: [
        'APPLICATION_STARTUP', 'CALL',
        'QRCODE_UPDATED', 'CONNECTION_UPDATE', 'LOGOUT_INSTANCE', 'REMOVE_INSTANCE',
        'MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'MESSAGES_DELETE', 'MESSAGES_SET', 'SEND_MESSAGE',
        'CHATS_UPSERT', 'CHATS_UPDATE', 'CHATS_DELETE', 'CHATS_SET',
        'CONTACTS_UPSERT', 'CONTACTS_UPDATE', 'CONTACTS_SET',
        'GROUPS_UPSERT', 'GROUP_UPDATE', 'GROUP_PARTICIPANTS_UPDATE',
        'PRESENCE_UPDATE',
        'LABELS_ASSOCIATION', 'LABELS_EDIT',
        'TYPEBOT_START', 'TYPEBOT_CHANGE_STATUS',
      ],
    },
    settings: {
      reject_call: false,
      msg_call: '',
      groups_ignore: true,
      always_online: true,
      read_messages: false,
      read_status: false,
      sync_full_history: true,
    },
  };

  window.evoAdmin = {
    create:      (name, payload) => call('create',      name, payload || window.BRAVA_INSTANCE_TEMPLATE),
    connect:     (name)          => call('connect',     name),
    state:       (name)          => call('state',       name),
    logout:      (name)          => call('logout',      name),
    delete:      (name)          => call('delete',      name),
    setWebhook:  (name, webhook) => call('setWebhook',  name, webhook),
    setSettings: (name, settings)=> call('setSettings', name, settings),
    fetchInfo:   (name)          => call('fetchInfo',   name),
  };

  console.log('[Brava] evoAdmin client pronto');
})();
