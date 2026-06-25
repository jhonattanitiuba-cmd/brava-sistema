# Handoff Financeiro — o que falta (plug and play)

Tudo no `admin/index.html` (~26k linhas). Validar sempre: `node scripts/check-jsx.js admin/index.html`.
Sem travessão e sem itálico nos textos. Commitar do repo local (não do Drive).

## Já feito (no ar)
- **#42** Conciliação consertada (abria na aba "sugestões" vazia → cai pra "todos" na 1a carga).
- **#43** Tabela: coluna **Vínculo** (parcial, ver D), **Fonte virou ícone** na Data, **Crédito/Débito/Saldo** no lugar de Valor, **atrasada** em vermelho + badge.
- **Banco 100% pronto** (migrations aplicadas): tabela `fin_rateios`; colunas `mostrar_no_previsto` / `mostrar_na_agenda` / `data_vencimento` / `pago` em fin_*; `frequencia` / `recorrencia_ate` / `ativo_na_agenda` em `fin_despesas`; tabela `fin_agenda_eventos`. RLS `authenticated` em todas.

## Falta (só front, banco pronto)

### A. RATEIO (1 pagamento → N destinos) — principal (ex: Garcia 2.400 = 1.200 + 1.200)
- **Clonar** `CaixaLancamentoModal` (16885-16992) → `RateioModal({ item, onClose })`: header com `item.valor`; lista de linhas [tipo (projeto/cliente/colaborador/contato/despesa) + seletor reusando `EscolherCliente` (17312-17336, devolve `onEscolher(tipo, clienteId, despesaId)`) + valor + categoria]; "Adicionar destino"/remover; rodapé `Restante = item.valor − soma`, **bloqueia Salvar se Restante ≠ 0** (tolerância 0,01).
- **Store** ao lado de `vincularManualConciliar` (14017-14037): `salvarRateio(origemId, linhas[])` = `delete from fin_rateios where extrato_id=` + insert em lote (`destino_tipo, destino_id, destino_label, valor, categoria_id`). `useRateios()` espelhando `useConciliacoesPendentes` (13939-13979): select `fin_rateios` + canal realtime `rt:fin_rateios`.
- **Ligar**: onClick da coluna Vínculo abre o `RateioModal`; badge "N destinos" se `rateios.length>1`. No `extrato` useMemo (16425) `naoConciliado = ... && rateios.length===0`; KPIs/DRE distribuem o valor pelos destinos/categorias.

### B. Checkbox "Mostrar no previsto" por linha
- Checkbox na linha (coluna ações) grava `mostrar_no_previsto` via `cli.from('fin_extrato_bancario'|'fin_caixa_lancamentos').update({ mostrar_no_previsto })`.
- No somatório de previsto/projetado (16545-16560, `prevPeriodo`/`entradasPrev`/`saidasPrev`) filtrar `i.mostrar_no_previsto !== false`. KPI cards 16641-16650 refletem.

### C. Recorrência + Agenda (no `DespesaModal`, 16015-16146)
- Add ao form: `frequencia` (select mensal|semanal|quinzenal|anual — **mensal = único 100% compatível com débito recorrente BTG**; demais = previsão interna, deixar nota na UI), `recorrencia_ate` (input date, padrão do `AgendarMensagemModal` ~5831), `ativo_na_agenda` (checkbox).
- Projeção do extrato (16461-16469, hoje só mensal por `dia_vencimento`): respeitar `frequencia` e parar em `recorrencia_ate`.
- **Agenda**: ao marcar agenda, upsert em `fin_agenda_eventos` (origem_tipo/origem_id/titulo/data/tipo/valor). A tela Agenda (`useAgenda` 24754-24766 + merge `events` em 25273) ganha 3a fonte: `cli.from('fin_agenda_eventos').select('*')`. `google_event_id` é gancho pra sync real do Calendar depois.

### D. Vínculo COMPLETO (hoje a coluna só abre a conciliação)
- Trocar o onClick do botão Vínculo (que chama `setConciliandoAberto`) por um seletor que vincula **empresa/colaborador/contato**: reusar `EscolherCliente` (17312, devolve `(tipo, clienteId, despesaId)`) gravando `cliente_id`/`projeto_id` (1 destino) ou criando rateio (N destinos, via A). Mostrar avatar+nome com `ClienteAvatar` (~3457).

## Padrões úteis
- Input base: `{ width:'100%', padding:'10px 12px', background:'var(--bg-3)', border:'1px solid var(--border)', borderRadius:8, color:'var(--t1)', fontSize:13, outline:'none' }`.
- Escrita supabase: `const cli = getSupa(); if(!cli) return; await cli.from('...').insert/update(...);` + `showToast?.(...)`.
- Hoje (ISO): `hojeISO` já existe (16408). Cliente helper: `getClienteLogo(nome)` (~3299), `ClienteAvatar` (~3457).
