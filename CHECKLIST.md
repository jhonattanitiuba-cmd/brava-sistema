# Checklist de Saúde do Sistema Brava

Roteiro de 5 minutos pra verificar se as pontas primordiais estão vivas.
Use antes de releases ou quando algo parecer estranho.

---

## 1. Landing Page (brava.software)

- [ ] `https://brava.software` carrega sem erro
- [ ] Intro toca em F5 (áudio + animação cascata)
- [ ] Voltar via botão "voltar" do browser **não** retoca a intro
- [ ] Toggle de som funciona (ON/OFF)
- [ ] Botões `Falar com especialista` e `Ver planos` clicam
- [ ] Vercel deploy mais recente está `READY` (`vercel list`)

## 2. Admin (brava.software/app/)

- [ ] Login com `diretoria@brava.company` funciona
- [ ] Header mostra a instância ativa correta
- [ ] Aba WhatsApp lista conversas com preview de mensagem
- [ ] Clicar numa conversa abre a thread
- [ ] Enviar mensagem do celular → chega no admin em < 3s (realtime)
- [ ] Trocar de instância no dropdown carrega a lista correta
- [ ] Botões Dashboard / Pipeline / Agenda / MRR / Analytics abrem

## 3. WhatsApp / Evolution

```sql
-- Volume nas últimas 24h por instância
SELECT i.nome,
  (SELECT COUNT(*) FROM wa_mensagens WHERE instancia_id = i.id AND timestamp > now() - interval '24 hours') AS msgs_24h,
  (SELECT COUNT(*) FROM wa_chats WHERE instancia_id = i.id AND last_message_ts > now() - interval '10 days') AS chats_ativos,
  i.status
FROM wa_instancias i
ORDER BY i.nome;
```

- [ ] Todas as instâncias `status = 'open'` têm msgs_24h > 0
- [ ] Cada chat ativo tem `last_message_text` populado
- [ ] Webhook `wa-webhook` sem onda de erros 500 (Supabase → Functions → Logs)

**Se faltar histórico:**
```bash
curl -X POST "https://buvduumggjpybhzbdqzm.supabase.co/functions/v1/wa-sync-history" \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"<EVOLUTION_INSTANCE_NAME>","daysBack":10}'
```
Se a instância tiver muitos chats, repetir com `offset` até `done: true`.

**Se previews estiverem vazios após sync:**
```sql
SELECT * FROM wa_reconcile_chats('<INSTANCIA_UUID>');
```

## 4. IA Responder

- [ ] Mensagem nova de cliente em instância com IA ATIVA → resposta da IA em < 30s
- [ ] Logs do `wa-ia-responder` (Supabase → Functions) sem 500
- [ ] Pill "IA ATIVA" verde no header da conversa
- [ ] "Vamos lá" desliga IA, "/ia on" liga de volta

## 5. Realtime

```sql
-- Publicações realtime habilitadas
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename LIKE 'wa_%'
ORDER BY tablename;
```

Esperado: `wa_chats`, `wa_contatos`, `wa_instancias`, `wa_mensagens`.

- [ ] As 4 tabelas estão na publication
- [ ] Aba WhatsApp não precisa F5 pra ver mensagem nova

## 6. Stripe / Pagamentos

- [ ] Página `/planos` na LP carrega os 3 planos
- [ ] Botão "Assinar" abre checkout do Stripe
- [ ] Após pagamento de teste, usuário aparece em `mrr_clients` com status correto
- [ ] Webhook do Stripe ativo no dashboard.stripe.com

## 7. Banco — Saúde Geral

```sql
-- Tamanho das tabelas principais
SELECT relname AS tabela,
       pg_size_pretty(pg_total_relation_size(C.oid)) AS tamanho
FROM pg_class C
LEFT JOIN pg_namespace N ON N.oid = C.relnamespace
WHERE N.nspname = 'public'
  AND C.relkind = 'r'
  AND relname IN ('wa_mensagens','wa_chats','wa_eventos_log','wa_contatos','mrr_clients','usuarios')
ORDER BY pg_total_relation_size(C.oid) DESC;
```

- [ ] `wa_eventos_log` < 100 MB (purge automático ativo)
- [ ] Sem RLS faltando em tabelas `wa_*`, `mrr_*`, `usuarios`, `workspaces`

```sql
-- Advisors do Supabase
-- Rode mcp__supabase__get_advisors com type='security' e type='performance'
```

## 8. Onboarding (cadastro novo cliente)

- [ ] Rota `/onboarding` carrega sem erro de console
- [ ] Step 1 (workspace) salva e avança
- [ ] Step Canal (WhatsApp) gera QR code e conecta
- [ ] Step final cria `workspace_members` corretamente

---

## Cabeças de impacto (se algo quebrar)

| Sintoma | Causa provável | Fix rápido |
|---|---|---|
| Lista de chats vazia no admin | Sync histórico não rodou | `wa-sync-history` + `wa_reconcile_chats` |
| Mensagens novas não aparecem | WS caído / token expirado | F5 no admin; ver realtime logs |
| 500 no `wa-webhook` em mensagens de mídia | Long.js do Baileys (`{low,high}` em bigint) | **CORRIGIDO em v6** com `toNumber()` — não deve mais ocorrer |
| 500 no `wa-webhook` em outros payloads | Evolution mandando payload novo | Ver `wa_eventos_log` onde `event_type LIKE '%error%'` |
| Intro toca duas vezes | bfcache do browser | Já mitigado, mas verificar se persiste |
| IA não responde | Edge `wa-ia-responder` 500 ou OpenAI quota | Logs + Supabase secrets |

### Lição aprendida (Maio/2026): wa-proxy precisa usar EVOLUTION_API_KEY global

A coluna `wa_instancias.evolution_apikey` pode ter sido copiada errada entre
instâncias (token de uma sendo usado por outras). Evolution retorna 401
quando o token não bate. **`wa-proxy` v6 prefere `EVOLUTION_API_KEY` do env**
(master key) e só usa o da instância como fallback. Funciona pra todas.

Endpoint `/chat/getBase64FromMediaMessage` é assim que mídia é descriptografada
(Baileys cripto). Sem isso, fotos/áudios/docs mostram "Falha ao baixar" ou
"Unauthorized".

### Lição aprendida (Maio/2026): Long.js do Baileys

Baileys serializa números grandes (`fileLength`, `seconds`, `messageTimestamp`)
como objetos Long.js: `{"low": 32645, "high": 0, "unsigned": true}`. Postgres
não converte isso pra bigint — gera 500 em **toda mensagem de mídia**.

**Padrão de defesa** (já aplicado em `wa-webhook` v6 e `wa-sync-history` v4):
```ts
function toNumber(v: any): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') return Number(v) || null;
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'object' && 'low' in v && 'high' in v) {
    return (v.high * 0x100000000) + (v.low >>> 0);
  }
  return null;
}
```

**Sempre use `toNumber()` antes de gravar campos numéricos** que venham
do payload do Evolution/Baileys (qualquer campo da árvore `message.*`).

---

**Cadência recomendada:**
- ✅ A cada release (deploy LP / admin / edge function)
- ✅ Toda segunda-feira de manhã
- ✅ Quando um cliente reclamar de algo

---

## Mapa lógico do banco (ordem de dependência)

Cada tabela tem `COMMENT ON TABLE` no Supabase com o número da camada — clique
na tabela no Studio pra ver a descrição.

```
Camada 0 — Identidade & Multi-tenant
├── [00] workspaces            ← raiz: todo recurso pertence a 1 workspace
├── [01] workspace_members     ← quem tem acesso (role: owner/admin/member)
└── [02] usuarios              ← perfis (espelha auth.users + metadata)

Camada 1 — Billing
├── [10] subscriptions         ← Stripe customer_id + price_id ativo
├── [11] mrr_clients           ← clientes ativos (snapshot dashboard)
└── [12] mrr_pagamentos        ← histórico recebimentos confirmados

Camada 2 — WhatsApp / Evolution
├── [20] wa_instancias         ← 1 por número WhatsApp conectado
├── [21] wa_contatos           ← contatos & grupos (1 por jid)
├── [22] wa_chats              ← conversas (com last_message_* preview)
├── [23] wa_mensagens          ← mensagens individuais (raw + extraído)
└── [24] wa_eventos_log        ← log webhook (TTL automático)
```

**Regra:** uma camada N só depende de camadas com número menor.
Ex: `wa_mensagens` (23) referencia `wa_chats` (22) que referencia
`wa_instancias` (20) que referencia `workspaces` (00).

**Por que não renomeei as tabelas com prefixos numéricos:**
Renomear quebraria edge functions, RLS policies, foreign keys, realtime
publication, função `user_can_access_instancia`, todo o admin JSX. Ganho
visual no Studio não vale o risco. A solução é o `COMMENT ON TABLE`
que aparece como descrição ao clicar — ordem lógica preservada sem
nenhuma quebra.
