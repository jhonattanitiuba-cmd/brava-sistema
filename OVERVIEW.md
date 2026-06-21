# Brava Sistema — Visão Geral

Documento de referência e onboarding do repositório. Consolida o que o sistema é,
como ele está organizado, como rodar e quais são os módulos, integrações e dados
principais. Para detalhes específicos, ver a seção [Documentação relacionada](#documentação-relacionada).

---

## 1. O que é

**Brava Company** é uma plataforma **SaaS multi-tenant** que une, em um só produto:

- **Atendimento via WhatsApp com IA** — agentes conversacionais (Claude) personalizados por cliente.
- **CRM + Pipeline** — clientes, projetos, propostas e checkpoints de implantação.
- **Financeiro** — fluxo de caixa, DRE, extrato bancário (BTG), parcelas e MRR.
- **Admin interno** — um "Copiloto operador" com acesso controlado a dados e ações.

O diferencial é a **IA Claude** operando em dois modos:

- **Agente Cliente** — responde automaticamente os contatos no WhatsApp de cada cliente (qualifica leads, atende, vende).
- **Copiloto Operador** — assistente interno que consulta o banco e executa ações para o operador, ativado por PIN no WhatsApp.

**Público-alvo:** micro-empresas e agências (B2B, planos recorrentes).
**Estágio:** em produção (3 instâncias WhatsApp, ~10 clientes, ~2.3k mensagens em histórico).

---

## 2. Stack tecnológico

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 18 via **CDN + Babel Standalone** (sem build step), CSS vanilla |
| **Backend** | Supabase — PostgreSQL 17 + Auth (JWT) + Realtime + Storage |
| **Edge Functions** | Deno / TypeScript |
| **IA** | Claude (Anthropic API) — Sonnet / Opus, configurável por cliente |
| **WhatsApp** | Evolution API (provedor não-oficial) |
| **Pagamentos** | Stripe → em transição para checkout próprio |
| **Banco (extrato)** | BTG Pactual (importação diária para o DRE) |
| **Hosting / Deploy** | Vercel (estático) |
| **CI/CD** | GitHub Actions (backup diário do Supabase, 9h UTC) |

> **Sem build step:** todo o JSX é transpilado no navegador via Babel Standalone.
> Deploy de frontend = `git push` → Vercel. Edge Functions são publicadas no Supabase.

---

## 3. Como rodar / buildar / testar

### Desenvolvimento local (frontend)
Não há etapa de build. Basta servir os arquivos estáticos:

```bash
cd brava-sistema
python -m http.server 8000
# Landing Page: http://localhost:8000/index.html
# App (cliente): http://localhost:8000/app/
# Admin (SaaS):  http://localhost:8000/admin/
```

### Build / Deploy
```bash
npm run build   # static site — não há build (no-op)
# Deploy automático: git push no branch principal → Vercel
```

### Scripts utilitários
```bash
node scripts/check-jsx.js          # validação de JSX (pre-commit)
bash scripts/backup-supabase.sh    # backup do Postgres (requer variáveis de ambiente)
```

### Automação
- Backup diário do Supabase via `.github/workflows/backup-supabase.yml` (09:00 UTC).

> **Observação:** não há suíte de testes automatizados. A verificação de saúde é
> manual — ver `CHECKLIST.md` (roteiro de ~5 minutos).

---

## 4. Estrutura de diretórios

```
brava-sistema/
├── index.html / app.jsx / styles.css   # Landing Page
├── components/                          # Componentes da LP (Hero, Plans, FAQ, ...)
├── app/                                 # App do cliente
│   └── app/                             #   auth, onboarding (wizard 4 passos), studio, confirmacao
├── admin/                               # Painel SaaS (SPA ~24k linhas)
│   └── app/                             #   studio, components, icons, supabase-client
├── checkout/                            # Página de checkout (Stripe)
├── supabase/functions/                  # Edge Functions (Deno/TS)
│   ├── wa-ia-responder/                 #   Agente IA + Copiloto
│   ├── wa-briefing-matinal/             #   Cron 07h
│   ├── wa-panorama-periodo/             #   Cron dia 15/30
│   └── wa-lembretes-dispatcher/         #   Cron a cada 5 min
├── clientes/                            # Dados/config por cliente em produção
├── scripts/                             # backup-supabase.sh, check-jsx.js
├── backups/                             # Snapshots de DB e edge functions
├── .github/workflows/                   # backup-supabase.yml
└── *.md                                 # Documentação estratégica (ver seção 9)
```

---

## 5. Módulos principais

1. **WhatsApp Inbox** — conversas em tempo real (Supabase Realtime), etiquetas, busca/filtros,
   composer com split de mensagens, agendamento e disparos, badges de não-lidas.
2. **Agente IA** (`wa-ia-responder`) — webhook recebe mensagem → debounce ~2s → carrega histórico →
   chama Claude com o prompt do cliente → resposta humanizada em chunks (com "digitando...").
   Configurável por cliente: `ai_enabled_global`, `ai_prompt`, `ai_model`, `ai_thinking_seconds`,
   `ai_typing_enabled`, `ai_split_enabled`.
3. **Copiloto Operador** — ativado por PIN no WhatsApp; conjunto de ferramentas (leitura, financeiro,
   operacional, ações) incluindo SQL com *allowlist* de tabelas, `WHERE` obrigatório, proibição de DDL
   destrutivo e auditoria completa.
4. **CRM + Pipeline** — Kanban de fases (Lead → ... → Ativo/Cancelado); cards de projeto com MRR e
   progresso de checkpoints; drag-and-drop entre fases.
5. **Financeiro / DRE** — Plano de Contas, regras de auto-classificação, extrato BTG, fluxo de caixa
   (recebido/pendente/atrasado/previsão 30/60/90d) e relatório DRE.
6. **Onboarding** — wizard de 4 passos: Identidade → WhatsApp (QR) → Equipe → IA.
7. **Automações (crons)** — briefing matinal (07h), panorama quinzenal/mensal (dia 15/30),
   despacho de lembretes (a cada 5 min).

---

## 6. Modelo de dados (entidades-chave)

**Tenancy / acesso**
- `workspaces` — tenant (conta do cliente): plano, owner, assinatura.
- `workspace_members` — RBAC: `owner` / `admin` / `manager` / `agent` / `viewer`.
- `usuarios` — usuários do sistema.

**Negócio**
- `clientes`, `projetos`, `projeto_parcelas` (fluxo de receita), `projeto_checkpoints` (tarefas de implantação).

**WhatsApp**
- `wa_instancias` (config por cliente), `wa_chats` (conversa, não-lidas, IA on/off),
  `wa_mensagens` (log de mensagens), `wa_contatos`, `chat_etiquetas`.

**Financeiro**
- `fin_extrato_bancario`, `fin_dre_categorias` (plano de contas), `fin_categoria_regras` (auto-classificação).

**IA / Copiloto**
- `copiloto_estado` (sessão ativada), `copiloto_lembretes`, `copiloto_audit_log` (auditoria de SQL).

**Segurança:** autorização via **RLS** por `workspace_id`. Roles via RBAC em `workspace_members`.
O Copiloto é restrito a uma *allowlist* de números (JIDs) + PIN.

---

## 7. Integrações externas

| Serviço | Uso | Status |
|---|---|---|
| **Evolution API** | Canal WhatsApp (não-oficial) | Em produção |
| **Claude (Anthropic)** | Motor de IA (Agente + Copiloto) | Em produção |
| **BTG Pactual** | Extrato bancário → DRE | Integrado (importação diária) |
| **Supabase Storage** | Upload de logos e fotos | Ativo |
| **Stripe** | Pagamentos | Em transição para checkout próprio |
| **Vercel** | Hosting da LP e checkout | Ativo |
| **GitHub Actions** | Backup diário do Supabase | Ativo |

---

## 8. Mapa de arquivos críticos

| Item | Arquivo | Tamanho aprox. |
|---|---|---|
| Landing Page | `index.html` | ~2k linhas |
| App (auth/onboarding/studio) | `app/index.html` + `app/app/*.jsx` | grande |
| Painel Admin (SPA) | `admin/index.html` + `admin/app/*.jsx` | ~24k linhas |
| Agente IA + Copiloto | `supabase/functions/wa-ia-responder/index.ts` | ~900 linhas |
| Briefing matinal (cron) | `supabase/functions/wa-briefing-matinal/index.ts` | — |
| Panorama do período (cron) | `supabase/functions/wa-panorama-periodo/index.ts` | — |
| Lembretes (cron) | `supabase/functions/wa-lembretes-dispatcher/index.ts` | — |
| Onboarding wizard | `app/app/onboarding.jsx` | grande |
| Cliente Supabase | `app/app/supabase-client.js`, `admin/app/supabase-client.js` | — |
| Backup do banco | `scripts/backup-supabase.sh` | — |
| Validador JSX | `scripts/check-jsx.js` | — |
| CI de backup | `.github/workflows/backup-supabase.yml` | — |

---

## 9. Documentação relacionada

- `HEALTH_REPORT.md` — estado do sistema e correções de RLS.
- `MAPA_IA_BRAVA.md` — funcionamento detalhado da IA (Agente vs. Copiloto) e ferramentas.
- `ROADMAP.md` — próximas features priorizadas.
- `KICKOFF_MODULO_DRE.md` — especificação do módulo financeiro/DRE.
- `CHECKLIST.md` — roteiro de verificação de saúde (~5 min).
- `HANDOFF.md` — design tokens e componentes de UI.

---

## 10. Observações e pontos de atenção

- **Sem testes automatizados** — a validação depende de `check-jsx.js` e do checklist manual.
- **SPAs monolíticos** — `app/index.html` e `admin/index.html` têm ~24k linhas cada, o que
  dificulta manutenção e revisão.
- **Stripe em transição** — pagamentos migrando para checkout próprio; estado parcial.
- **Sem build step** — bom para simplicidade de deploy, mas sem tree-shaking, minificação
  ou checagem de tipos em tempo de build.
