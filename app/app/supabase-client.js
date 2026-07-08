// ═══════════════════════════════════════════════════════════
// SUPABASE CLIENT - Brava Sistema
// ═══════════════════════════════════════════════════════════
// Este arquivo cria uma instância única do cliente Supabase
// e disponibiliza globalmente via window.supabase.
//
// Uso em qualquer lugar:
//   const { data, error } = await window.supabase
//     .from('workspaces')
//     .select('*');
//
// Auth:
//   const { user } = await window.supabase.auth.getUser();
// ═══════════════════════════════════════════════════════════

(function () {
  const SUPABASE_URL = 'https://cryinggazelle-supabase.cloudfy.live';
  const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgzMzU1NzU2LCJleHAiOjE4MTQ4OTE3NTZ9.kD6Lh8oDxhpai5PwYijapL95zRPVkOesH6Ow86Hnn-4';

  // O SDK do Supabase, quando carregado via CDN, expõe globalmente como `supabase`
  // (objeto com `.createClient`). Vamos renomear pra `window._supabaseSDK` e
  // criar nossa instância como `window.supabase`.
  if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
    console.error('[Brava] SDK Supabase não carregado. Verifique se o script da CDN está no <head>.');
    return;
  }

  const { createClient } = window.supabase;

  // Sobrescreve a referência global pra ser a instância já configurada
  window.supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // MESMO storageKey do admin (getSupa) → logar no /app/ vale no /admin/ (sessão única)
      storageKey: 'brava_sb_auth',
    },
  });

  // PONTE: client separado SO pra edge functions, que ainda rodam no Supabase antigo
  // (mas gravam no banco novo). O client de BANCO acima segue no cryinggazelle.
  window.supabaseFn = createClient(
    'https://buvduumggjpybhzbdqzm.supabase.co',
    'sb_publishable_j4V4fiVSYHgMS4fu_RnScw_vZOr0KBT',
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  console.log('[Brava] Supabase client pronto:', SUPABASE_URL);
})();
