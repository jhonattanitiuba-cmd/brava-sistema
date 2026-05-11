// ═══════════════════════════════════════════════════════════
// SAVE ONBOARDING — Persiste dados do wizard no Supabase
// ═══════════════════════════════════════════════════════════
// Uso:
//   const ws = await window.saveOnboarding(data);
//   // ws = { id, slug, name, plan, ... }
//
// O que faz:
// 1. Pega o usuário logado (auth.uid())
// 2. Faz upload do logo (se houver) pro bucket workspace-logos
// 3. Insere registro em `workspaces`
// 4. Insere registro em `workspace_members` com role='owner'
// 5. Devolve o workspace criado
// ═══════════════════════════════════════════════════════════

(function () {
  // Converte data URL (base64) em Blob pra fazer upload
  function dataUrlToBlob(dataUrl) {
    if (!dataUrl || !dataUrl.startsWith('data:')) return null;
    const [meta, data] = dataUrl.split(',');
    const mime = (meta.match(/data:([^;]+)/) || [])[1] || 'application/octet-stream';
    const isBase64 = meta.includes(';base64');
    const bytes = isBase64
      ? atob(data)
      : decodeURIComponent(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  // Resolve a extensão do arquivo a partir do MIME type
  function extFromMime(mime) {
    const map = {
      'image/png':     'png',
      'image/jpeg':    'jpg',
      'image/jpg':     'jpg',
      'image/webp':    'webp',
      'image/svg+xml': 'svg',
    };
    return map[mime] || 'png';
  }

  // Sanitiza slug: lowercase, sem acento, só letras/números/hífen
  function sanitizeSlug(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
  }

  window.saveOnboarding = async function (data) {
    if (!window.supabase) throw new Error('Supabase não carregado.');

    // 1) Pega usuário logado
    const { data: { user }, error: ue } = await window.supabase.auth.getUser();
    if (ue || !user) throw new Error('Você precisa estar logado pra finalizar o onboarding.');

    const slug = sanitizeSlug(data.slug || data.workspaceName);
    if (!slug || slug.length < 3) throw new Error('Slug do workspace inválido (mínimo 3 caracteres).');

    // 2) Upload do logo (se foi enviado como data URL)
    let logoPublicUrl = null;
    if (data.logoUrl && data.logoUrl.startsWith('data:')) {
      const blob = dataUrlToBlob(data.logoUrl);
      if (blob) {
        const ext  = extFromMime(blob.type);
        const path = `${slug}/logo.${ext}`;
        const { error: ue2 } = await window.supabase.storage
          .from('workspace-logos')
          .upload(path, blob, { upsert: true, contentType: blob.type });
        if (ue2) {
          console.warn('[Brava] Falha no upload do logo:', ue2);
        } else {
          const { data: pub } = window.supabase.storage
            .from('workspace-logos')
            .getPublicUrl(path);
          logoPublicUrl = pub?.publicUrl || null;
        }
      }
    } else if (data.logoUrl && /^https?:/.test(data.logoUrl)) {
      logoPublicUrl = data.logoUrl;
    }

    // 3) Pega plano vindo da URL ou metadata do usuário
    const urlParams = new URLSearchParams(window.location.search);
    const planoVindo = urlParams.get('plano')
                    || user.user_metadata?.plano
                    || 'trial';

    // 4) Insere workspace
    const { data: workspace, error: we } = await window.supabase
      .from('workspaces')
      .insert({
        slug,
        name:           data.workspaceName || data.bizName || 'Sem nome',
        logo_url:       logoPublicUrl,
        primary_color:  data.primaryColor || '#7B3FE4',
        secondary_color: data.secondaryColor || null,
        dark_mode:      !!data.darkMode,
        plan:           planoVindo,
        status:         'trial',
        trial_ends_at:  new Date(Date.now() + 7*24*60*60*1000).toISOString(), // +7 dias
        stripe_customer_id:    user.user_metadata?.stripe_customer_id || null,
        stripe_subscription_id: user.user_metadata?.stripe_subscription_id || null,
      })
      .select()
      .single();

    if (we) {
      if (we.code === '23505') throw new Error(`O slug "${slug}" já está em uso. Escolha outro.`);
      throw new Error(we.message || 'Erro ao criar workspace.');
    }

    // 5) Insere member como owner
    const { error: me } = await window.supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id:      user.id,
        role:         'owner',
        joined_at:    new Date().toISOString(),
      });

    if (me) {
      console.error('[Brava] Falha ao criar workspace_member:', me);
      throw new Error('Workspace criado, mas houve erro ao vincular o usuário. Contate o suporte.');
    }

    console.log('[Brava] Workspace criado com sucesso:', workspace);
    return workspace;
  };
})();
