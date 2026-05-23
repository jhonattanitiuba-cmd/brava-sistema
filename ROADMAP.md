# 🗺️ Roadmap Brava — Próximas Evoluções

> Planejamento detalhado das 3 grandes melhorias pré-produção.
> Cada feature: visão · backend · UI · esforço · dependências.

---

## 🎯 Visão geral

| # | Feature | Esforço | Dependência | Prioridade |
|---|---|---|---|---|
| 1 | **Equipe real + convites** | 2-3h | nenhuma | 🔴 ALTA (produção) |
| 2 | **MRR → Financeiro completo** | 4-6h | Equipe (pra atribuir transações) | 🟡 MÉDIA |
| 3 | **Pipeline tipo Trello** | 5-7h | Equipe + Etiquetas | 🟢 BAIXA (já tem básico) |

**Ordem sugerida:** 1 → 2 → 3 (cada uma depende parcialmente da anterior)

---

## 1. 👥 Equipe Real + Convites

### Por que primeiro
Vai pra **produção**. Você precisa convidar Priscilla, Gabriel, etc. Hoje os usuários estão hardcoded no `BRAVA_USERS`.

### Estado atual
- ✅ Tabela `usuarios` existe
- ✅ `workspace_members` controla acesso por workspace
- ❌ Aba "Equipe" mostra dados mock (hardcoded)
- ❌ Sem fluxo de convite
- ❌ Sem foto upload
- ❌ Sem gestão de roles

### Backend

```sql
-- Estender wa_instancias pra mostrar quem pode atender cada uma
-- (já existe owner_email pra instâncias privadas)

-- Tabela de convites pendentes
CREATE TABLE convites (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  email text,
  role text,           -- owner | admin | manager | agent | viewer
  token text UNIQUE,
  invited_by uuid,
  invited_at timestamptz,
  accepted_at timestamptz,
  expires_at timestamptz  -- 7 dias
);

-- Estender usuarios com flags
ALTER TABLE usuarios ADD COLUMN ativo boolean DEFAULT true;
ALTER TABLE usuarios ADD COLUMN ultimo_login timestamptz;
ALTER TABLE usuarios ADD COLUMN foto_url text;
```

**Edge Function `invite-user`:**
- Recebe `{ email, role, workspace_id }`
- Valida que quem chama é owner/admin
- Cria usuário em `auth.users` com senha temporária
- Manda email via Supabase Auth `inviteUserByEmail()`
- Insere em `workspace_members`

### Frontend

**Aba "Equipe" refatorada:**
```
┌──────────────────────────────────────────────────────┐
│ Equipe                            [+ Convidar membro] │
├──────────────────────────────────────────────────────┤
│ [👤 Jhonattan]  Owner    online agora      [⚙ Editar]│
│ [👤 Priscilla]  Admin    há 2h             [⚙ Editar]│
│ [👤 Gabriel]    Agent    há 1 dia          [⚙ Editar]│
│ [👤 Pendente]   Manager  convite enviado   [✕ Cancelar]│
└──────────────────────────────────────────────────────┘
```

**Modal "Convidar membro":**
- Email (input)
- Role (select: owner / admin / manager / agent / viewer)
- Quais instâncias pode acessar (checkboxes)
- Mensagem custom opcional

**Modal "Editar usuário":**
- Foto (upload pro storage)
- Nome, telefone
- Role (dropdown)
- Toggle ativo/inativo
- Instâncias acessíveis (multiselect)
- Botão "Remover do workspace"

### Roles propostas

| Role | Pode | Não pode |
|---|---|---|
| **owner** | Tudo + faturamento + deletar workspace | — |
| **admin** | Tudo + convidar membros + editar config | Mexer faturamento/deletar workspace |
| **manager** | Ver tudo + atribuir conversas + ver financeiro | Convidar membros |
| **agent** | Atender conversas atribuídas a ele | Ver outras conversas, financeiro |
| **viewer** | Só leitura (dashboard, métricas) | Atender, atribuir, editar |

### Subtarefas
- [ ] Tabela `convites` + RLS
- [ ] Estender `usuarios` com `ativo`, `foto_url`, `ultimo_login`
- [ ] Edge Function `invite-user` (cria auth + insere member)
- [ ] Refatorar componente `Equipe.jsx` pra ler do banco
- [ ] Modal `ConvidarMembroModal`
- [ ] Modal `EditarUsuarioModal`
- [ ] Upload de foto pro storage `brava-user-photos`
- [ ] Indicador online/offline (presence)
- [ ] Trigger pra atualizar `ultimo_login` no signIn

### Esforço estimado
**2-3 horas** de implementação.

---

## 2. 💰 MRR → Financeiro Completo

### Por que segundo
Depende de ter `usuarios` real pra atribuir "criado por" nas transações.

### Estado atual
- ✅ Tabela `mrr_clients` (clientes pagantes)
- ✅ Tabela `mrr_pagamentos` (histórico)
- ❌ Não tem despesas
- ❌ Não tem fluxo de caixa
- ❌ Não tem DRE
- ❌ Não tem categorias customizadas

### Backend

```sql
-- Nova: transações genéricas (entrada/saída)
CREATE TABLE transacoes (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  tipo text,                 -- 'entrada' | 'saida'
  categoria_id uuid,
  descricao text,
  valor numeric(14,2),
  data_competencia date,    -- mês a que se refere
  data_caixa date,           -- quando entrou/saiu de fato
  cliente_id uuid,           -- vinculado a um cliente (opcional)
  fornecedor text,           -- nome do fornecedor (saída)
  status text,               -- 'previsto' | 'confirmado' | 'cancelado'
  origem text,               -- 'manual' | 'stripe' | 'mrr_auto'
  comprovante_url text,
  observacao text,
  created_by uuid,
  created_at timestamptz
);

-- Categorias hierárquicas
CREATE TABLE categorias_financeiras (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  parent_id uuid,
  nome text,
  tipo text,                 -- 'entrada' | 'saida' | 'ambos'
  cor text,
  icone text
);

-- Seed categorias padrão:
-- Entradas: MRR Assinaturas, Vendas Únicas, Freelas, Outros
-- Saídas: Infraestrutura, Salários, Marketing, Ferramentas SaaS,
--         Impostos, Pró-labore, Comissões, Materiais, Outros

-- Views úteis
CREATE VIEW fluxo_caixa_mensal AS
SELECT 
  date_trunc('month', data_caixa) AS mes,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE 0 END) AS entradas,
  SUM(CASE WHEN tipo='saida' THEN valor ELSE 0 END) AS saidas,
  SUM(CASE WHEN tipo='entrada' THEN valor ELSE -valor END) AS saldo
FROM transacoes
WHERE status = 'confirmado'
GROUP BY 1;

CREATE VIEW dre_mensal AS ...  -- DRE simplificado por mês
```

### Frontend

**Aba renomeada de "MRR" → "Financeiro":**

```
┌────────────────────────────────────────────────────────┐
│ Financeiro                              [+ Transação]  │
├────────────────────────────────────────────────────────┤
│ Tabs: [Resumo] [MRR] [Entradas] [Saídas] [Fluxo Caixa]│
├────────────────────────────────────────────────────────┤
│ RESUMO DE MAIO/2026                                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ Entradas │ │  Saídas  │ │  Lucro   │ │   MRR    │  │
│ │ R$ 18.5K │ │  R$ 4.2K │ │ R$ 14.3K │ │ R$ 12.9K │  │
│ │   +12%   │ │   -3%    │ │   +18%   │ │   +5%    │  │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                        │
│ [Gráfico: receita vs despesa últimos 6 meses]         │
│                                                        │
│ TOP CATEGORIAS DESPESAS:                              │
│  Infraestrutura  R$ 1.8K (43%)  ████████              │
│  Salários        R$ 1.2K (29%)  █████                 │
│  Ferramentas     R$ 800 (19%)   ███                   │
└────────────────────────────────────────────────────────┘
```

**Modal "Nova Transação":**
- Tipo: Entrada / Saída
- Categoria (dropdown hierárquico)
- Descrição
- Valor
- Data competência (mês de referência)
- Data caixa (quando saiu)
- Cliente vinculado (autocomplete, opcional)
- Fornecedor (se saída)
- Status: Previsto / Confirmado
- Comprovante (upload opcional)

**Sub-aba "Fluxo de Caixa":**
- Tabela mensal: entradas - saídas = saldo
- Saldo acumulado
- Projeção de 3 meses (extrapolação)
- Filtro por categoria

### Integrações futuras
- ✅ Stripe webhook → auto-criar transação de entrada
- 🟡 Bradesco/Itaú PIX (via OFX export)
- 🟡 Notas fiscais (NFe.io API)

### Subtarefas
- [ ] Tabelas `transacoes` + `categorias_financeiras` + RLS
- [ ] Seed categorias padrão
- [ ] Views `fluxo_caixa_mensal` e `dre_mensal`
- [ ] Renomear item "MRR" pra "Financeiro" no menu
- [ ] Componente `Financeiro.jsx` com tabs
- [ ] 4 KPI cards (entradas, saídas, lucro, MRR)
- [ ] Gráfico de barras receita vs despesa (Chart.js ou D3)
- [ ] Tabela top categorias com barras horizontais
- [ ] Modal `NovaTransacaoModal`
- [ ] Sub-tab "Fluxo de Caixa" com tabela mensal
- [ ] Sub-tab "DRE" estilo demonstrativo
- [ ] Webhook Stripe → auto-cria transação entrada

### Esforço estimado
**4-6 horas** de implementação.

---

## 3. 📋 Pipeline tipo Trello

### Por que terceiro
Já tem básico funcional (cards arrastáveis). Depende de Etiquetas (já tem) e Equipe (pra atribuir).

### Estado atual
- ✅ Colunas drag-and-drop
- ✅ Cards aparecem (criados via Monitoramento)
- ❌ Cards são placeholders simples (só nome do cliente)
- ❌ Sem edição inline
- ❌ Sem checklist dentro do card
- ❌ Sem comentários
- ❌ Sem atribuição
- ❌ Sem data de vencimento

### Backend

```sql
-- Cards do pipeline (substitui o localStorage atual)
CREATE TABLE pipeline_cards (
  id uuid PRIMARY KEY,
  workspace_id uuid,
  coluna_id text,            -- 'lead' | 'proposta' | ... | custom
  titulo text NOT NULL,
  descricao text,
  agente_id uuid,            -- atribuído a quem
  contact_jid text,          -- vincula contato WhatsApp
  contact_instancia_id uuid,
  data_vencimento date,
  valor_estimado numeric(12,2),  -- pra cards de vendas
  ordem int,
  archived_at timestamptz,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz
);

-- Checklist dentro do card
CREATE TABLE pipeline_card_checklist (
  id uuid PRIMARY KEY,
  card_id uuid REFERENCES pipeline_cards(id) ON DELETE CASCADE,
  titulo text,
  done boolean DEFAULT false,
  done_by uuid,
  done_at timestamptz,
  ordem int
);

-- Comentários no card (estilo Trello)
CREATE TABLE pipeline_card_comments (
  id uuid PRIMARY KEY,
  card_id uuid REFERENCES pipeline_cards(id) ON DELETE CASCADE,
  user_id uuid,
  texto text,
  created_at timestamptz
);

-- Etiquetas no card (reusa tabela etiquetas existente)
CREATE TABLE pipeline_card_etiquetas (
  card_id uuid,
  etiqueta_id uuid,
  PRIMARY KEY (card_id, etiqueta_id)
);
```

### Frontend

**Card colapsado (na coluna):**
```
┌─────────────────────────┐
│ 🔴 Quente               │  ← etiqueta colorida
│ Hub Imobiliário Alessandro │  ← título
│ "Negociar 30 dias..."    │  ← descrição (truncada)
│                          │
│ ☑ 3/8  📎 2  💬 5       │  ← checklist, anexos, comments
│ [👤] [👤]    📅 25/05    │  ← avatares + vencimento
└─────────────────────────┘
```

**Modal de detalhe (expandido):**
```
┌──────────────────────────────────────────────────────┐
│ Hub Imobiliário Alessandro                       [✕] │
│ Coluna: Proposta                                     │
│ Etiquetas: [🔴 Quente] [🟢 Cliente] [+]              │
├──────────────────────────────────────────────────────┤
│ 📝 DESCRIÇÃO                              [editar]   │
│ Negociar 30 dias de implementação inicial            │
│ com R$ 1.990/mês após go-live                        │
├──────────────────────────────────────────────────────┤
│ ☑ CHECKLIST                              [+ Add]    │
│ [✓] Briefing recebido                                │
│ [✓] Proposta enviada                                 │
│ [ ] Contrato assinado                                │
│ [ ] Primeiro pagamento                               │
├──────────────────────────────────────────────────────┤
│ 👤 ATRIBUÍDO A                                       │
│ [Jhonattan] [+ Add]                                  │
├──────────────────────────────────────────────────────┤
│ 💬 WHATSAPP VINCULADO                                │
│ +55 11 99556-8148  (Alessandro)                      │
│ Última msg: "Maravilha, vamos pra cima" há 2h        │
│ [Abrir conversa →]                                   │
├──────────────────────────────────────────────────────┤
│ 📅 VENCIMENTO                                        │
│ 30/05/2026  (em 7 dias)                              │
├──────────────────────────────────────────────────────┤
│ 💬 COMENTÁRIOS (5)                                   │
│ [👤 Jhonattan] - 14:30                               │
│ Ele topou o setup de 6k iniciais                     │
│ [👤 Priscilla] - 15:00                               │
│ Vou preparar o contrato                              │
│ [+ Comentar...]                                      │
├──────────────────────────────────────────────────────┤
│ [🗑 Arquivar]                       [Salvar / Fechar]│
└──────────────────────────────────────────────────────┘
```

### Funcionalidades-chave

1. **Editar título inline** — click no título do card vira input
2. **Adicionar card rapidinho** — botão "+ Adicionar card" no fim de cada coluna, input simples
3. **Drag & drop** — entre colunas (já tem)
4. **Atribuição** — escolhe agente da equipe
5. **Vinculação WhatsApp** — autocomplete de contato; mostra última msg no modal
6. **Checklist** — toggle, conta concluídos
7. **Comentários** — timeline estilo Trello
8. **Etiquetas** — reusa sistema de etiquetas existente
9. **Data de vencimento** — calendário; cards vencendo ficam destaque
10. **Arquivar** — soft delete (mantém histórico)

### Filtros (topo da página)

```
[ Meus cards ] [ Vencendo essa semana ] [ Sem responsável ]
[ Etiqueta: Quente ▼ ] [ Atribuído a: ▼ ]  [Buscar...]
```

### Migração do estado atual

O `localStorage.brava_pipeline` precisa migrar pro banco. Vou criar função `migrarPipelineLocalParaBanco()` que roda uma vez:
- Lê localStorage
- Insere cada card como `pipeline_cards`
- Limpa localStorage

### Subtarefas
- [ ] Tabelas `pipeline_cards` + `pipeline_card_checklist` + `pipeline_card_comments` + `pipeline_card_etiquetas` + RLS + realtime
- [ ] Hook `usePipelineCards()` com realtime
- [ ] Migrar localStorage existente pro banco (one-shot)
- [ ] Refatorar componente `Pipeline.jsx`: cards do banco
- [ ] Componente `PipelineCard` (compacto)
- [ ] Modal `PipelineCardDetalhe` com tudo
- [ ] Edição inline de título
- [ ] Quick-add card no fim da coluna
- [ ] Atribuição de agente
- [ ] Vinculação WhatsApp (autocomplete)
- [ ] Checklist interno
- [ ] Comentários timeline
- [ ] Etiquetas no card
- [ ] Data de vencimento + alerta visual
- [ ] Barra de filtros no topo
- [ ] Arquivar (soft delete)

### Esforço estimado
**5-7 horas** de implementação (o componente mais complexo).

---

## 📊 Resumo Final

```
TOTAL ESFORÇO ESTIMADO: 11-16 horas
```

Pode ser feito em **2-3 sessões** de trabalho.

### Ordem recomendada de execução

```
Sessão 1 (2-3h):  Equipe + Convites          ← URGENTE pra produção
                  ↓ desbloqueia atribuição em cards/transações
Sessão 2 (4-6h):  Financeiro completo
                  ↓ libera tomada de decisão financeira
Sessão 3 (5-7h):  Pipeline tipo Trello
                  ↓ vira ferramenta de operação diária
```

### Decisões em aberto

Antes de começar Sessão 1, preciso confirmar:

1. **Plano gratuito do Supabase suporta `inviteUserByEmail`?**
   → Sim, mas tem rate limit de 30 emails/hora. Pra MVP serve.

2. **Foto de usuário: storage no Supabase ou URL externa?**
   → Storage interno (bucket `brava-user-photos`). Mais controle.

3. **Pra equipe: começar com quantas pessoas?**
   → Você + Priscilla + Gabriel = 3 usuários reais

4. **Financeiro: começar do zero ou importar histórico?**
   → Sugestão: importar Stripe via webhook + você cadastra despesas manualmente (start simples)

5. **Pipeline: migrar cards atuais do localStorage?**
   → Sim, função one-shot que copia tudo no primeiro carregamento

---

**Próximo passo:** confirma a ordem (1 → 2 → 3) e qual sessão quer começar agora?
