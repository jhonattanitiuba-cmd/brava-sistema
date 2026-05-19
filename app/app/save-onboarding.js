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

    // 6) Cria registro wa_instancias (se o user pareou WhatsApp no step Canal)
    // O instance JÁ FOI CRIADO na Evolution pelo StepChannel via evoAdmin.create.
    // Aqui só inserimos no Supabase com o workspace_id correto + ai_prompt.
    if (data.evolutionInstanceName && data.qrScanned) {
      try {
        // Constroi prompt da IA a partir dos campos do step 4 (Agente IA)
        const aiPrompt = _construirPromptIA(data);

        const { data: instance, error: ie } = await window.supabase
          .from('wa_instancias')
          .insert({
            workspace_id:           workspace.id,
            nome:                   `WhatsApp ${data.bizName || data.workspaceName || slug}`,
            evolution_url:          'https://lickingbuffalo-evolution.cloudfy.live',
            evolution_instance_name: data.evolutionInstanceName,
            evolution_apikey:       'D5E5DC9D636D-49C5-AF9C-CB1F6E0089F1',
            status:                 'open',
            owner_email:            null, // publico do workspace por padrao
            ai_enabled_global:      true,
            ai_model:               data.bizModel || 'claude-opus-4-5',
            ai_typing_enabled:      true,
            ai_thinking_seconds:    3.0,
            ai_split_enabled:       true,
            ai_reading_seconds:     2.5,
            ai_prompt:              aiPrompt,
          })
          .select()
          .single();

        if (ie) {
          console.warn('[Brava] Falha ao criar wa_instancias:', ie);
          // Nao falha o onboarding - user pode criar instancia depois pelo admin
        } else {
          console.log('[Brava] wa_instancias criada:', instance.id);
          // Sincroniza profile (foto, nome real do WhatsApp) em background
          fetch('https://buvduumggjpybhzbdqzm.supabase.co/functions/v1/wa-instance-admin', {
            method: 'POST',
            headers: {'content-type':'application/json', 'apikey': 'sb_publishable_j4V4fiVSYHgMS4fu_RnScw_vZOr0KBT'},
            body: JSON.stringify({action: 'fetchInfo', instanceName: data.evolutionInstanceName}),
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('[Brava] Erro inesperado ao criar wa_instancias:', e);
      }
    }

    // 7) Convida membros adicionais (workspace_members) — best-effort
    if (Array.isArray(data.invites)) {
      for (const inv of data.invites) {
        if (!inv?.email || !inv.email.includes('@')) continue;
        if (inv.email.toLowerCase() === (user.email || '').toLowerCase()) continue; // owner ja foi
        try {
          // Tenta encontrar o user pelo email; se nao existir, fica como invite pendente
          const { data: existingUser } = await window.supabase
            .from('usuarios').select('id').eq('email', inv.email.toLowerCase()).maybeSingle();
          if (existingUser?.id) {
            await window.supabase.from('workspace_members').insert({
              workspace_id: workspace.id,
              user_id:      existingUser.id,
              role:         inv.role || 'agent',
              joined_at:    new Date().toISOString(),
            }).catch(() => {}); // ignora se ja existir
          }
          // TODO: se nao existir, criar invite pendente em tabela workspace_invites
        } catch {}
      }
    }

    console.log('[Brava] Workspace criado com sucesso:', workspace);
    return workspace;
  };

  // Helper: converte os campos do step "Agente IA" em prompt formatado pra IA
  function _construirPromptIA(data) {
    const lines = [];
    lines.push('# IDENTIDADE');
    lines.push(`Você é o assistente de atendimento da ${data.bizName || data.workspaceName}.`);
    if (data.bizDoes) lines.push(`\n## O que a empresa faz\n${data.bizDoes}`);
    if (data.bizPublico) lines.push(`\n## Público\n${data.bizPublico}`);
    if (data.bizLocalizacao) lines.push(`\n## Localização\n${data.bizLocalizacao}`);
    if (data.bizHours) lines.push(`\n## Horário de atendimento\n${data.bizHours}`);
    if (data.bizProdutos) lines.push(`\n## Produtos e preços\n${data.bizProdutos}`);
    if (data.bizTicketMedio) lines.push(`\n## Ticket médio\n${data.bizTicketMedio}`);
    if (data.bizDiferenciais) lines.push(`\n## Diferenciais\n${data.bizDiferenciais}`);
    if (data.bizConcorrentes) lines.push(`\n## Concorrentes\n${data.bizConcorrentes}`);
    if (data.bizPolitica) lines.push(`\n## Política de cancelamento\n${data.bizPolitica}`);
    if (data.bizPagamento) lines.push(`\n## Formas de pagamento\n${data.bizPagamento}`);
    if (data.bizPrazo) lines.push(`\n## Prazos\n${data.bizPrazo}`);
    if (data.bizCanais) lines.push(`\n## Canais\n${data.bizCanais}`);
    if (data.bizFaq) lines.push(`\n## FAQ\n${data.bizFaq}`);
    if (data.bizBoasVindas) lines.push(`\n## Mensagem de boas-vindas\n${data.bizBoasVindas}`);
    if (data.bizEscalonamento) lines.push(`\n## Quando escalar para humano\n${data.bizEscalonamento}`);
    if (data.bizLimitacoes) lines.push(`\n## Limitações (NÃO fazer)\n${data.bizLimitacoes}`);
    if (data.bizTone) {
      const toneMap = {
        'profissional-amigavel': 'Profissional e amigável. Use linguagem clara, respeitosa mas próxima.',
        'formal': 'Formal. Use tratamento formal, sem gírias.',
        'informal': 'Descontraído. Pode usar linguagem casual mas sempre profissional.',
      };
      lines.push(`\n## Tom de voz\n${toneMap[data.bizTone] || data.bizTone}`);
    }
    lines.push('\n## Regras gerais');
    lines.push('- Sempre confirme informações antes de afirmar dados que não estão acima.');
    lines.push('- Se não souber, escale para humano em vez de inventar.');
    lines.push('- Mantenha respostas curtas (2-4 frases) salvo quando o cliente pedir detalhes.');
    lines.push('- Use [SPLIT] entre 2+ ideias pra dividir em bolhas separadas.');
    return lines.join('\n');
  }
})();
