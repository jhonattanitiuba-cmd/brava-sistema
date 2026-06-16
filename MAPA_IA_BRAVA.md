# MAPA DE USO DA IA DA BRAVA

> Documento de referência. Última atualização: 16/jun/2026.
> Código-fonte: `supabase/functions/wa-ia-responder/index.ts` (+ funções auxiliares).

---

## 1. Visão geral

A IA da Brava vive dentro de **uma única edge function** (`wa-ia-responder`) que se comporta de **dois jeitos diferentes** dependendo de quem está falando:

| Modo | Quem dispara | O que faz |
|---|---|---|
| **Agente Cliente** | Qualquer pessoa que manda mensagem pro WhatsApp de um cliente Brava | Atende, qualifica, responde como vendedor/SDR da empresa daquele cliente |
| **Copiloto Operador** | Só o Jhonattan (número na allowlist), depois de ativar | Vira um analista interno que consulta e opera o sistema da Brava |

Mais 4 funções auxiliares que rodam sozinhas (sem ninguém mandar mensagem):
- `wa-briefing-matinal` (todo dia 07h)
- `wa-panorama-periodo` (dia 15 e dia 30)
- `wa-lembretes-dispatcher` (a cada 5 min)
- `wa-webhook` (recebe os eventos do WhatsApp e grava no banco)

---

## 2. Como uma mensagem entra no sistema

```
Pessoa manda WhatsApp
        │
        ▼
Evolution API (provedor não-oficial do WhatsApp)
        │  dispara webhook
        ▼
wa-webhook (edge function)
        │  grava em wa_mensagens, wa_chats, wa_contatos
        ▼
Trigger no banco chama wa-ia-responder
        │
        ▼
wa-ia-responder DECIDE o modo  ◄──── coração da lógica
```

### Filtros de entrada (mensagem é ignorada se):
- `from_me` (foi a própria Brava que mandou)
- `ia_generated` (foi a IA que gerou, evita loop)
- não é texto (áudio/imagem ainda não processados)
- é grupo (`@g.us`) ou broadcast

---

## 3. A bifurcação (o "DECIDE o modo")

```
Mensagem chega no wa-ia-responder
        │
        ▼
  É de um OPERADOR?  (número está em BRAVA_OPERADOR_JIDS)
        │
   ┌────┴─────┐
  SIM         NÃO
   │           │
   │           ▼
   │     MODO AGENTE CLIENTE
   │     (atende como vendedor da empresa cliente)
   │
   ▼
  É comando de ativação/desativação?
   │
   ├── "Brava Copilot <PIN>" ──► ativa sessão copiloto (grava copiloto_estado)
   ├── "Brava sair" ───────────► desativa
   │
   ▼
  Sessão copiloto está ATIVA?
   │
   ┌────┴─────┐
  SIM         NÃO
   │           │
   ▼           ▼
 MODO        SILÊNCIO
 COPILOTO    (não responde nada;
 OPERADOR     não atende o dono como se fosse cliente)
```

**Detalhe importante:** o número do operador (Jhonattan) é reconhecido pelos **últimos 8 dígitos** (à prova de variação do 9º dígito) e resolve `@lid` (privacidade nova do WhatsApp) consultando `wa_contatos`.

---

## 4. MODO AGENTE CLIENTE (atendimento)

É o atendimento automático que cada cliente da Brava recebe no WhatsApp dele.

### Fluxo:
```
1. "Digitando..." aparece imediatamente (presença humanizada)
2. Debounce 2s  (espera caso a pessoa mande várias mensagens em sequência)
3. Recheck: se chegou mensagem mais nova, aborta (a nova vai processar)
4. Carrega histórico (últimas 40 mensagens do chat)
5. Chama Claude com o PROMPT do cliente (campo ai_prompt da instância)
6. Espera o "tempo pensando" configurado (ai_thinking_seconds)
7. Quebra a resposta em mensagens curtas ([SPLIT]) pra parecer humano
8. Envia cada pedaço com "digitando..." entre eles
9. Marca as mensagens como ia_generated (evita loop)
```

### Configuração por cliente (tabela `wa_instancias`):
- `ai_enabled_global` — liga/desliga a IA daquele cliente
- `ai_prompt` — a personalidade/instruções do agente daquele cliente
- `ai_model` — qual modelo Claude usar
- `ai_typing_enabled` — mostra "digitando..."
- `ai_thinking_seconds` — quanto "pensa" antes de responder
- `ai_split_enabled` — quebra em várias mensagens

### Liga/desliga granular:
- Por cliente inteiro: `wa_instancias.ai_enabled_global`
- Por conversa específica: `wa_chats.ai_enabled` (desliga só num chat)

---

## 5. MODO COPILOTO OPERADOR (interno do Jhonattan)

O assistente que ajuda você a entender e operar o negócio.

### Como ativar:
```
Você manda:  Brava Copilot 341652
             (comando + PIN)
        ▼
Sistema grava copiloto_estado (ativo=true, ativado_em=agora)
        ▼
Responde: "Copiloto Brava ativado. Pode pedir: ..."
        ▼
A partir daqui, TUDO que você mandar é tratado como pergunta/ordem ao copiloto
        ▼
Pra encerrar:  Brava sair
```

### Memória (16/jun/2026):
Carrega as **últimas 24h** da conversa (ou desde a ativação, o que for mais recente). Você pode referenciar coisas ditas mais cedo no dia.

### Cérebro:
- **Modelo:** Claude Opus 4.8
- **Loop de ferramentas:** até 8 iterações por pergunta (pode encadear várias consultas antes de responder)
- **Estilo:** português direto, WhatsApp, sem preâmbulo, negrito pra números

### As 19 ferramentas do Copiloto:

**Leitura geral (4):**
| Tool | Pra que |
|---|---|
| `resumo_negocio` | Visão geral: clientes, MRR, projetos, equipe, nichos |
| `buscar_cliente` | Status/nicho/projetos/checkpoints de um cliente |
| `conversas_recentes` | Quem mandou mensagem, não-lidas |
| `metricas_whatsapp` | Volume de mensagens, % IA |

**Leitura financeira (5):**
| Tool | Pra que |
|---|---|
| `fluxo_caixa` | Recebido, pendente, atrasado, previsão 30/60/90d |
| `parcelas_atrasadas` | Quem está devendo, quanto, há quantos dias |
| `pagamentos_recentes` | O que caiu no extrato bancário |
| `consultar_cliente_financeiro` | Situação financeira completa de um cliente |
| `previsao_recebimento` | O que entra numa janela de datas específica |

**Leitura operacional (6):**
| Tool | Pra que |
|---|---|
| `pipeline_propostas` | Propostas em aberto, MRR potencial |
| `projetos_em_implantacao` | O que está em onboarding, prazos |
| `checkpoints_pendentes` | Itens de checklist em aberto |
| `agenda_hoje` | O que vence/entrega hoje |
| `proximas_entregas` | Prazos contratuais próximos |
| `o_que_falta_no_projeto` | Situação completa de um projeto |

**Ações sem confirmação (3):**
| Tool | Pra que |
|---|---|
| `marcar_parcela_paga` | "Recebi X de Y" → marca como pago |
| `enviar_msg_cliente` | "Manda mensagem pro Z" → envia no WhatsApp |
| `criar_lembrete` | "Me lembra amanhã 9h de..." → agenda |

**Acesso direto ao banco (1) — o coringa:**
| Tool | Pra que |
|---|---|
| `executar_sql` | Qualquer pergunta/ação que as tools acima não cobrem |

---

## 6. Acesso ao banco (executar_sql) e seus freios

```
Copiloto quer rodar SQL
        ▼
Função PG copiloto_exec_sql  (SECURITY DEFINER)
        │
        ├─ 1. Bloqueia palavras proibidas
        │     (DROP, TRUNCATE, ALTER, CREATE, GRANT, REVOKE, etc)
        │
        ├─ 2. Detecta operação (SELECT / INSERT / UPDATE / DELETE)
        │
        ├─ 3. SELECT/WITH/EXPLAIN ──► livre (qualquer tabela), máx 1000 linhas
        │
        ├─ 4. INSERT/UPDATE/DELETE ─► só na ALLOWLIST de 24 tabelas
        │        e UPDATE/DELETE EXIGE WHERE
        │
        ├─ 5. Executa
        │
        └─ 6. Registra TUDO em copiloto_audit_log
              (comando, query, linhas afetadas, sucesso/erro, duração)
```

### Tabelas que o copiloto PODE escrever:
clientes, projetos, projeto_parcelas, projeto_checkpoints, project_checkpoints, projeto_etiquetas, cliente_etiquetas, projeto_checklists, projeto_checklist_itens, projeto_anexos, projeto_pagamentos, copiloto_* (lembretes/memoria/estado), fin_* (todas as financeiras), wa_chats, wa_contatos

### Tabelas BLOQUEADAS pra escrita:
auth.* (logins), wa_instancias (config das instâncias), wa_mensagens (histórico bruto), qualquer *_log, workspace*, usuarios

### Auditoria:
Tudo fica em `copiloto_audit_log`. Pra revisar:
```sql
SELECT * FROM copiloto_audit_log ORDER BY executado_em DESC LIMIT 20;
```

---

## 7. Automações que rodam sozinhas (crons)

```
07:00 BRT todo dia  ──► wa-briefing-matinal
                        Panorama do dia: vencimentos, atrasados,
                        próximos 7d, previsão 30d, conversas não-lidas

18:00 BRT dia 15    ──► wa-panorama-periodo (quinzenal)
                        Receita real 1-15, comparativo mês anterior,
                        top clientes, resultado bruto

18:00 BRT dia 30    ──► wa-panorama-periodo (mensal)
                        Fechamento do mês inteiro

a cada 5 minutos    ──► wa-lembretes-dispatcher
                        Dispara lembretes vencidos da copiloto_lembretes
```

Todos enviam pelo número **SistemaBravaCompany** (Brava Principal) pro seu WhatsApp pessoal.

**Crons registrados** (pg_cron):
- `wa-briefing-matinal-07h` → `0 10 * * *` (UTC)
- `wa-panorama-quinzenal` → `0 21 15 * *`
- `wa-panorama-mensal` → `0 21 30 * *`
- `wa-lembretes-dispatcher-5min` → `*/5 * * * *`

---

## 8. Tabelas que sustentam tudo

| Tabela | Papel |
|---|---|
| `wa_instancias` | Cada cliente = 1 instância. Config da IA, credenciais Evolution |
| `wa_mensagens` | Toda mensagem (recebida e enviada) |
| `wa_chats` | Conversas (última msg, não-lidas, ai_enabled) |
| `wa_contatos` | Contatos (nome, telefone, etiquetas) |
| `wa_eventos_log` | Log de eventos da IA (ai.replied, copiloto.replied, erros) |
| `copiloto_estado` | Sessão do copiloto (ativo/inativo por chat) |
| `copiloto_lembretes` | Lembretes agendados |
| `copiloto_audit_log` | Auditoria de tudo que o copiloto executa no banco |
| `clientes` / `projetos` / `projeto_parcelas` | Núcleo do negócio (CRM + financeiro) |
| `fin_*` | Módulo financeiro (extrato, DRE, despesas) |

---

## 9. Segurança (camadas)

1. **Allowlist de operador** — só números autorizados viram copiloto
2. **PIN de ativação** — comando precisa do PIN correto
3. **Sessão explícita** — copiloto só responde se foi ativado
4. **Allowlist de tabelas** — escrita restrita a 24 tabelas de negócio
5. **WHERE obrigatório** — sem UPDATE/DELETE em massa acidental
6. **Palavras proibidas** — nada de DDL destrutivo
7. **Auditoria total** — toda ação fica gravada e é reversível manualmente
8. **Anti-loop** — mensagens da IA são marcadas e ignoradas na entrada

---

## 10. Segredos (env vars no Supabase)

| Secret | Pra que |
|---|---|
| `ANTHROPIC_API_KEY` | Chamadas ao Claude |
| `BRAVA_OPERADOR_JIDS` | CSV de números autorizados (hoje só o Jhonattan) |
| `BRAVA_COPILOT_PIN` | PIN de ativação do copiloto |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Acesso ao banco |

---

## 11. Resumo de um dia típico

```
07:00  Briefing matinal chega no seu WhatsApp (automático)
       "Hoje: R$ X a receber, Y atrasados, Z conversas não-lidas"

09:30  Você ativa: "Brava Copilot 341652"
       "Quanto entra essa semana?"  → ele responde
       "Marca a parcela do Garcia como paga"  → ele executa
       "Me lembra às 15h de ligar pro Wanderley"  → agenda

12:00  Cliente do EstacionePark manda WhatsApp
       → Modo Agente Cliente responde sozinho, qualifica o lead

15:00  Lembrete chega: "Ligar pro Wanderley" (automático)

18:00  (se for dia 15 ou 30) Panorama do período chega

Durante o dia: cada cliente da Brava tem seu próprio agente
               atendendo no WhatsApp deles, em paralelo.
```
