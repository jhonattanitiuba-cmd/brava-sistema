// ═══════════════════════════════════════════════════════════
// SUPABASE CLIENT — Brava Sistema
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
  const SUPABASE_URL = 'https://buvduumggjpybhzbdqzm.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j4V4fiVSYHgMS4fu_RnScw_vZOr0KBT';

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
    },
  });

  console.log('[Brava] Supabase client pronto:', SUPABASE_URL);
})();
