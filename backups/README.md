# Backups Supabase — Brava Company

Esta pasta contém **snapshots automáticos diários** do banco de dados e do código-fonte das Edge Functions do Supabase. Rodam às **6h da manhã (horário de Brasília)** via GitHub Actions.

## Estrutura

```
backups/
├── database/
│   ├── 2026-05-27.sql.gz   ← dump diário (rotação de 30 dias)
│   ├── 2026-05-26.sql.gz
│   └── ...
├── edge-functions/
│   ├── notify-captacao/
│   │   └── index.ts
│   ├── wa-webhook/
│   │   └── index.ts
│   └── ... (uma pasta por function)
└── MANIFEST.md             ← gerado automaticamente a cada backup
```

## Como restaurar o banco

### Cenário 1: Quero recriar TUDO num projeto Supabase novo

```bash
# 1. Cria projeto novo no Supabase (anota a connection string)
export NEW_DB_URL="postgresql://postgres.NOVO:SENHA@..."

# 2. Restaura o dump mais recente
gunzip -c backups/database/2026-05-27.sql.gz | psql "$NEW_DB_URL"
```

### Cenário 2: Quero restaurar apenas algumas tabelas

```bash
# Extrai o SQL pra arquivo legível
gunzip -c backups/database/2026-05-27.sql.gz > /tmp/dump.sql

# Edita /tmp/dump.sql e pega só o que precisa
# Depois roda:
psql "$SUPABASE_DB_URL" -f /tmp/dump_filtrado.sql
```

## Como restaurar Edge Functions

```bash
# Para uma function específica:
supabase functions deploy notify-captacao \
  --project-ref buvduumggjpybhzbdqzm \
  --file backups/edge-functions/notify-captacao/index.ts

# Para TODAS as functions de uma vez:
for fn in backups/edge-functions/*/; do
  name=$(basename "$fn")
  echo "Deployando $name..."
  supabase functions deploy "$name" \
    --project-ref buvduumggjpybhzbdqzm \
    --file "$fn/index.ts"
done
```

## Como rodar um backup manual (fora do schedule)

### Via GitHub Actions
1. Vai em `Actions` → `Backup Supabase (diario)`
2. Clica em `Run workflow` (botão à direita)

### Via terminal (precisa configurar localmente)
```bash
# Pega o connection string do banco:
# Supabase Dashboard → Settings → Database → Connection string (URI)
export SUPABASE_DB_URL="postgresql://postgres.buvduumggjpybhzbdqzm:SENHA@..."

# Pega o access token:
# Supabase Dashboard → Account → Access Tokens → Generate new token
export SUPABASE_ACCESS_TOKEN="sbp_..."

export SUPABASE_PROJECT_REF="buvduumggjpybhzbdqzm"

bash scripts/backup-supabase.sh
```

## Setup inicial (precisa fazer 1 vez)

Para o GitHub Actions rodar, **dois secrets** precisam estar configurados no repositório:

### 1. SUPABASE_DB_URL
- Vai em **Supabase Dashboard** → `Settings` → `Database`
- Em **Connection string**, escolhe `URI` e o mode **Session** (porta 5432) ou **Transaction** (porta 6543)
- Copia a string completa (já inclui a senha)
- No GitHub: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
  - Name: `SUPABASE_DB_URL`
  - Value: cola a connection string

### 2. SUPABASE_ACCESS_TOKEN
- Vai em **Supabase Dashboard** → clica no avatar (canto superior direito) → `Account` → `Access Tokens`
- `Generate new token`, dá um nome tipo "GitHub Actions Backup"
- Copia o token (`sbp_...`) — só aparece uma vez
- No GitHub: mesmo lugar, novo secret
  - Name: `SUPABASE_ACCESS_TOKEN`
  - Value: cola o token

Pronto. O workflow vai rodar automaticamente no próximo dia às 6h, e você pode disparar manual a qualquer momento.

## Rotação e tamanho

- **Banco:** mantém os 30 dumps mais recentes (script remove os mais antigos automaticamente). Cada dump comprimido fica ~5–20MB dependendo do volume de dados.
- **Edge Functions:** sempre sobrescreve com o estado atual (sem histórico — o histórico vem do git mesmo).

Tamanho esperado da pasta após 1 mês: ~500MB no pior caso.
