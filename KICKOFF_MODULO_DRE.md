# KICKOFF - Modulo DRE customizavel (admin Brava)

> Cole/abra numa sessao nova do Claude Code dentro de
> C:\Users\Usar\projetos\SAAS BRAVA COMPANY\0. SISTEMA DE HOSPEDAGEM
> Objetivo: construir as 4 telas do modulo financeiro DRE no admin/index.html.
> Regra do CEO: tudo customizavel (criar/editar/apagar), nada engessado, plug-and-play.

## Contexto: o BACKEND JA ESTA PRONTO (feito em 04/jun/2026)

Integracao BTG do extrato CONSERTADA e funcionando:
- Edge function `btg-sync` v24: importa extrato (endpoint correto + type=simple + dailyMovements + dateHour),
  atualiza saldo, importa categoria do BTG (campo btg_categoria) e chama auto-classificacao.
- Cron `btg-daily-sync` 6h diario (puxa ultimos 7 dias, dedup por external_transaction_id).
- Extrato hoje: 385 lancamentos 100% BTG (jan-jun), fonte='btg_sync'. PDF foi aposentado.
- Dedup: indice unico COMPLETO em external_transaction_id (uniq_fin_extrato_external_tx).

## Tabelas (Supabase) ja criadas e editaveis (RLS authenticated all)

1. `fin_dre_categorias` (plano de contas):
   id, codigo, nome, natureza (entrada|saida|ambos), grupo_dre, ordem, cor, ativo, descricao, timestamps.
   grupo_dre IN (receita_bruta, deducoes, custos, despesas_operacionais, despesas_pessoal,
   despesas_financeiras, nao_operacional, nao_dre). Ja populada com 31 categorias (ponto de partida).
2. `fin_extrato_bancario` (ja existia) ganhou colunas: categoria_id (FK fin_dre_categorias),
   btg_categoria (text, hint do BTG). Ja tem cliente_id, projeto_id, valor (negativo=saida), data, descricao.
3. `fin_categoria_regras`: id, padrao (texto normalizado: minusculo, sem acento), categoria_id,
   cliente_id (opcional), prioridade, ativo. ~23 regras de alta confianca ja inseridas.
4. Funcao `public.fin_auto_classificar(p_somente_sem_categoria boolean)` -> classifica por regras,
   retorna qtd. Ja roda no fim de cada sync.

Estado atual da classificacao: 96 de 385 classificados; 289 a classificar (compras no debito, postos,
PIX para pessoas). Regra de pro-labore precisa afinar direcao (entrada do socio = aporte, nao pro-labore).

## AS 4 TELAS A CONSTRUIR (no admin/index.html, padrao React CDN+Babel, sem build)

### Tela 1 - Plano de Contas (CRUD de categorias)
- Listar fin_dre_categorias agrupadas por grupo_dre, ordenadas por ordem.
- Criar / editar (nome, grupo_dre via select, cor, natureza, ativo), apagar, reordenar (drag ou setas).
- Avisar ao apagar categoria em uso (lancamentos com aquele categoria_id viram nulo via ON DELETE SET NULL).

### Tela 2 - Regras de auto-classificacao (CRUD)
- Listar/criar/editar/apagar regras (padrao -> categoria + cliente opcional + prioridade).
- Botao "Reclassificar agora" -> chama rpc fin_auto_classificar(true) (so sem categoria) ou (false) (tudo).
- Normalizar o padrao ao salvar (minusculo, sem acento) pra bater com a funcao.

### Tela 3 - Marcacao no extrato
- Tabela do extrato (fin_extrato_bancario) com filtro por periodo/conta/status (a classificar / classificado).
- Por linha: dropdown categoria + (nas entradas) cliente/projeto. Salva no banco na hora.
- Acao em lote: selecionar varias linhas e aplicar categoria.
- Destacar visualmente o que falta classificar (289 hoje).
- REQUISITO DO CEO (04/jun): a coluna de status/vinculo ("conciliado") deve ser TOTALMENTE EDITAVEL
  inline: clicar e poder vincular o que quiser, trocar categoria, trocar cliente/projeto, desvincular,
  marcar ignorado. Hyper-personalizavel, nada fixo. Hoje o componente fica em admin/index.html por volta
  da linha ~15560-15690 (tabela do Financeiro). Ja existe edicao inline de categoria, MAS usa as listas
  antigas de texto (CATS_ENTRADA/CATS_SAIDA) — MIGRAR esse dropdown para usar fin_dre_categorias
  (categoria_id) em vez do campo texto. Ja foi feito um quick-win: o "conciliado" virou botao clicavel
  que abre a conciliacao (setConciliandoAberto). Falta a edicao granular inline.
- Funcoes de store ja existentes p/ reusar: vincularExtratoComPagamento/DespesaPag/Caixa,
  desvincularExtrato, marcarExtratoIgnorado, salvarCategoria (~linha 12395-12433 e 15207-15217).

### Tela 4 - Relatorio DRE
- Seletor de periodo (mes/intervalo).
- Estrutura: Receita Bruta / (-) Deducoes / = Receita Liquida / (-) Custos / = Lucro Bruto /
  (-) Despesas (op+pessoal+financeiras) / = Resultado Operacional / (+/-) Nao-operacional / = Resultado Liquido.
  nao_dre fica FORA do resultado (aporte, emprestimo, distribuicao, familia, transferencia).
- Margem %, comparativo mensal, drill-down por categoria, e por cliente/projeto.
- Mostrar aviso de "X lancamentos a classificar (R$ Y)" pra nao ler DRE incompleto como verdade.

Logica do calculo (ja validada via SQL): somar valor por grupo_dre (valor ja tem sinal),
subtotais conforme acima. Query de referencia esta no historico desta conversa.

## Padroes do admin (seguir)
- React 18 via CDN + Babel Standalone, sem build. Componentes no admin/index.html.
- Supabase client ja disponivel (getSupa()). RLS authenticated all nessas tabelas, entao CRUD direto.
- Formatacao WhatsApp/UI: ver convencoes do arquivo. Cores tokens var(--...).
- Deploy: git add/commit/push -> Vercel auto (repo jhonattanitiuba-cmd/brava-sistema, conta Brava).
  Credencial git no Windows: usar a conta jhonattan (limpar credencial EuGabis se aparecer).
- Validar Babel antes de commit (o arquivo e grande; erro de JSX derruba tudo).

## Restricoes de estilo do CEO
- Sem travessao (em-dash), sem emoji decorativo, sem a palavra "redacao".
- Comunicacao direta. Plug-and-play: tudo editavel por ele, nada hardcoded.
- Nunca colar service_role/secret no chat.

## Primeiro passo sugerido na sessao nova
1. Abrir admin/index.html, localizar a area Financeiro (ja existe: fin_caixa, fin_despesas, extrato).
2. Adicionar item de menu/aba "DRE" e "Plano de Contas".
3. Construir Tela 1 (Plano de Contas) primeiro, depois 2, 3, 4. Deploy e teste a cada tela.
