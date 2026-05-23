# 🏥 Health Report — Sistema Brava
> Verificação completa do sistema em 23/05/2026 · 18:30 BRT

## 📊 Sumário Executivo

| Camada | Status | Nota |
|---|---|---|
| **WhatsApp / Mensagens** | 🟢 Saudável | Espelhamento real-time funcionando |
| **Banco de Dados** | 🟢 Saudável | 10MB, longe dos limites do plano free |
| **Edge Functions** | 🟢 6/6 ativas | Todas respondendo |
| **Realtime** | 🟢 7 tabelas | Publication completa |
| **Segurança (RLS)** | 🟡 Corrigido AGORA | 3 ERROS críticos achados e resolvidos durante esta análise |
| **Performance** | 🟡 Aceitável | Algumas otimizações pendentes (não-críticas) |
| **IA** | 🟢 Brava ativa, Jhonattan OFF (correto) | |
| **Etiquetas & Checkpoints** | 🟢 Operacional | 40 etiquetas, 191 checkpoints seedados |

**Veredito:** Sistema está saudável e em produção. **3 vulnerabilidades de RLS foram corrigidas DURANTE esta análise** (workspaces, workspace_members, subscriptions estavam sem RLS habilitado mesmo tendo policies).

---

## 1. 📱 WhatsApp & Instâncias

### Volume real por instância (medido agora)

| Instância | Status | IA | Chats | Grupos | Msgs 24h | Última msg | Contatos | Com nome | Com foto |
|---|---|---|---|---|---|---|---|---|---|
| **Jhonattan** | 🟢 open | ❌ OFF | 480 | 36 | **197** | há 5min | 3066 | 2399 (78%) | 390 |
| **Brava Principal** | 🟢 open | ✅ ON (c/ prompt) | 31 | 4 | 8 | há 43min | 140 | 24 (17%) | 64 |
| **Financeiro** | 🔴 refused | ❌ OFF | 0 | 0 | 0 | — | 0 | 0 | 0 |

**Insights:**
- Jhonattan: instância mais ativa (197 msgs/24h), nomes 78% populados — bom
- Brava Principal: pouco tráfego (esperado, é o número da empresa) mas IA ativa com prompt configurado
- Financeiro: **CONEXÃO RECUSADA** — precisa reconectar via QR (não é bug, sessão WhatsApp caiu)

### Mídia
- **494 mídias** capturadas só na Jhonattan (fotos/áudios/documentos)
- Webhook processando mídias sem erros após fix Long.js (v6)

---

## 2. 💾 Banco de Dados

### Tamanho das 15 maiores tabelas

```
wa_mensagens         5.4 MB    ← maior (esperado, conversas)
wa_eventos_log       2.0 MB    ← OK, com purge automático
wa_contatos          1.6 MB
wa_chats             416 KB
wa_instancias        200 KB
project_checkpoints  112 KB
workspaces            80 KB
workspace_members     80 KB
usuarios              80 KB
mrr_pagamentos        80 KB
etiquetas             72 KB
mrr_clients           48 KB
chat_etiquetas        40 KB
subscriptions         40 KB
checkpoint_templates  32 KB
```

**Total: ~10 MB.** Plano free do Supabase tem **500 MB** — estamos em **2%** do limite.

### Logs do webhook

```
Total wa_eventos_log: 561 registros
Eventos última 1h:    1
Erros última 1h:      0  ✅
IA respondeu 24h:     6  
IA erros 24h:         0  ✅
```

---

## 3. ⚡ Edge Functions

| Função | Versão | Status | Função |
|---|---|---|---|
| `wa-webhook` | v6 | 🟢 ACTIVE | Recebe mensagens Evolution → banco |
| `wa-ia-responder` | v8 | 🟢 ACTIVE | Chama Claude pra responder no WhatsApp |
| `wa-proxy` | v6 | 🟢 ACTIVE | Proxy seguro pra Evolution API |
| `wa-instance-admin` | v5 | 🟢 ACTIVE | Operações de admin (create/connect/state) |
| `wa-sync-history` | v4 | 🟢 ACTIVE | Sync histórico de mensagens |
| `wa-sync-profile-pics` | v1 | 🟢 ACTIVE | Download de fotos de perfil |
| `wa-sync-contacts` | v1 | 🟢 ACTIVE | Sync de contatos |

**Health check do `wa-webhook`:** retornou `{"ok":true,"service":"wa-webhook"}` ✅

---

## 4. 🔒 Segurança (Advisors do Supabase)

### 🚨 ERROS CRÍTICOS — JÁ CORRIGIDOS NESTA ANÁLISE

Antes desta verificação, **3 tabelas estavam com policies criadas mas RLS desabilitado**:

| Tabela | Status anterior | Status agora |
|---|---|---|
| `workspaces` | ❌ Dados expostos publicamente | ✅ RLS habilitado |
| `workspace_members` | ❌ Dados expostos publicamente | ✅ RLS habilitado |
| `subscriptions` | ❌ Dados expostos publicamente | ✅ RLS habilitado |

**Fix aplicado:** migration `enable_rls_critical_tables`.

### ⚠️ Warnings (não-críticos)

| Issue | Impacto | Ação sugerida |
|---|---|---|
| 6 funções com `search_path` mutable | Baixo (apenas em ataques específicos) | Adicionar `SET search_path = public` |
| 3 policies com `qual=true` (`mrr_clients`, `mrr_pagamentos`, `usuarios`) | Médio (RLS permissivo demais) | Revisar policies pra serem específicas |
| View `usuarios_stats` com SECURITY DEFINER | Baixo | Trocar pra SECURITY INVOKER |
| Bucket `workspace-logos` permite listagem pública | Baixo (só logos) | OK pra esse caso |
| 7 funções SECURITY DEFINER expostas via RPC | Baixo (necessárias) | OK, são intencionais |
| Proteção contra senhas vazadas DESLIGADA | Médio | Ativar em Auth settings |

---

## 5. ⚡ Performance (Advisors)

### ⚠️ Warnings notáveis

**1. RLS initplan (auth.uid() re-avaliado por linha)**
- Afeta: `workspaces`, `workspace_members` (3 policies)
- Fix: trocar `auth.uid()` por `(SELECT auth.uid())` — ganho real em escala
- **Impacto atual: BAIXO** (poucos rows). Crítico só com milhares de workspaces

**2. Multiple permissive policies em `wa_instancias` e `workspace_members`**
- 2 policies fazendo o mesmo trabalho pra mesma role/action
- Fix: consolidar em 1 policy por role/action
- **Impacto: BAIXO**

**3. 14 índices nunca usados**
```
idx_workspaces_slug, idx_workspaces_stripe_customer,
idx_members_workspace, idx_subs_workspace, idx_subs_stripe,
idx_wa_inst_workspace, idx_wa_contatos_phone, idx_wa_chats_unread,
idx_usuarios_role, idx_wa_instancias_owner_user_id,
idx_mrr_clients_status, idx_mrr_pag_cliente, idx_mrr_pag_competencia,
idx_checkpoints_cliente, idx_checkpoints_fase,
idx_etiquetas_ws, idx_etiquetas_inst, idx_chat_etiquetas_etiqueta
```
- São índices criados "por garantia" mas nunca foram usados em query
- Custo: espaço em disco + slowdown em INSERT
- **Decisão: NÃO mexer.** São cheap e ficam prontos quando a aplicação crescer

**4. 4 foreign keys sem índice de cobertura**
- `chat_etiquetas.applied_by`, `etiquetas.created_by`, `project_checkpoints.created_by` / `done_by`
- Impacto: cascata de DELETE/UPDATE no auth.users pode ficar lenta
- **Impacto atual: NULO** (raramente apaga user)

---

## 6. 📡 Realtime Publication

```sql
supabase_realtime escutando:
  ✅ wa_chats
  ✅ wa_mensagens
  ✅ wa_contatos
  ✅ wa_instancias
  ✅ etiquetas        ← novo (etiquetas)
  ✅ chat_etiquetas   ← novo
  ✅ project_checkpoints  ← novo (monitoramento)
```

Total: **7 tabelas** com push automático pro front. Tudo o que admin precisa ver em tempo real está habilitado.

---

## 7. 🏷️ Etiquetas & 📋 Checkpoints (Monitoramento)

### Etiquetas
- **40 etiquetas** criadas (5 workspaces × 8 etiquetas padrão)
- **0 chats etiquetados ainda** (sistema novo, você ainda não aplicou nenhuma)

### Checkpoints
- **191 checkpoints** seedados pra 10 clientes
- **0 concluídos ainda** (você ainda não marcou nenhum)
- Clientes com checkpoints:
  - Alessandro - Hub Imob, CasaUrba, Clínica Reunidas
  - Dra. Thalita Morete, EAG Agro, EstacionePark
  - Garcia Sadler, Ldccell Sorocaba, Master Aviação, VapoCamping Hotel

---

## 8. ✅ Issues Encontradas + Resolvidas (esta análise)

| # | Problema | Impacto | Resolução |
|---|---|---|---|
| 1 | RLS desabilitado em `workspaces` | 🔴 Dados expostos publicamente | ✅ Migration aplicada |
| 2 | RLS desabilitado em `workspace_members` | 🔴 Dados expostos publicamente | ✅ Migration aplicada |
| 3 | RLS desabilitado em `subscriptions` | 🔴 Dados financeiros expostos | ✅ Migration aplicada |
| 4 | `checkpoint_templates` com RLS sem policy | ⚠️ Acesso bloqueado | ✅ Policy de leitura pública (são só templates) |

---

## 9. 📋 Pendências (não-críticas, podem aguardar)

### 🟡 Pra resolver quando der tempo

1. **Reconectar instância Financeiro** — está com `status=refused`, basta abrir WhatsApp e escanear QR de novo
2. **Otimizar RLS initplan** — quando passar de 100 workspaces
3. **Consolidar multiple permissive policies** em `wa_instancias` e `workspace_members`
4. **Trocar `usuarios_stats` view pra SECURITY INVOKER**
5. **Ativar proteção contra senhas vazadas** no Supabase Auth settings (URL: dashboard → Authentication → Policies)
6. **Fixar `search_path` nas 6 funções warning** (adicionar `SET search_path = public`)

### 🟢 Tudo OK (não precisa mexer)

- Tamanho do banco (2% do limite)
- Edge Functions (todas funcionando)
- Webhook (0 erros nas últimas 1h)
- IA (respondendo, configurada corretamente)
- Realtime (7 tabelas publicadas)
- Espelhamento de mensagens (delay < 3s)
- Auth real do Supabase (JWT funcionando)
- Download de mídia (fixed Long.js)
- Formatação rica das mensagens (parágrafos + bold + links)

---

## 📈 Métricas-chave (snapshot)

```
🔢 NÚMEROS DO SISTEMA HOJE
─────────────────────────────
3 instâncias WhatsApp (2 conectadas, 1 desconectada)
2.302 mensagens totais no banco
3.206 contatos cadastrados
511 chats únicos
500 mídias capturadas (foto/áudio/doc)
197 mensagens nas últimas 24h
6 respostas da IA nas últimas 24h
40 etiquetas configuradas
191 checkpoints distribuídos em 10 clientes
10 MB de dados (2% do limite free)
```

---

## 🛠️ Próximas evoluções sugeridas

Por ordem de impacto:

1. **Filtro por etiqueta** na barra de busca do WhatsApp (você pediu etiquetas, falta filtrar)
2. **Notificações automáticas** quando projeto fica crítico (Monitoramento)
3. **Histórico de mudanças de fase** no Pipeline
4. **Auto-mover cliente entre fases** quando todos checkpoints da fase estão done
5. **Export CSV** dos checkpoints / conversas
6. **Métricas de IA por instância** (taxa de sucesso, tempo médio de resposta)

---

**Próximo health check sugerido:** segunda-feira de manhã, ou após qualquer release importante.
