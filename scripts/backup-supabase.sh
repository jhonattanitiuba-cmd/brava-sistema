#!/usr/bin/env bash
# Backup automatizado do Supabase (banco + edge functions)
# Roda no GitHub Actions diariamente, ou manualmente: bash scripts/backup-supabase.sh
#
# Requer variaveis de ambiente:
#   SUPABASE_DB_URL       - connection string completa do Postgres
#                            ex: postgresql://postgres.PROJREF:SENHA@aws-0-REGION.pooler.supabase.com:6543/postgres
#   SUPABASE_ACCESS_TOKEN - Personal Access Token do Supabase (Account > Access Tokens)
#   SUPABASE_PROJECT_REF  - ID do projeto (ex: buvduumggjpybhzbdqzm)

set -euo pipefail

# ─── Validacao ──────────────────────────────────────────────────────────────
: "${SUPABASE_DB_URL:?precisa exportar SUPABASE_DB_URL}"
: "${SUPABASE_ACCESS_TOKEN:?precisa exportar SUPABASE_ACCESS_TOKEN}"
: "${SUPABASE_PROJECT_REF:?precisa exportar SUPABASE_PROJECT_REF}"

DATA=$(date -u +"%Y-%m-%d")
ROOT="backups"
DB_DIR="$ROOT/database"
FN_DIR="$ROOT/edge-functions"

mkdir -p "$DB_DIR" "$FN_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  Backup Supabase | $DATA"
echo "  Project: $SUPABASE_PROJECT_REF"
echo "═══════════════════════════════════════════════════════════════"

# ─── 1. Banco completo (schema + dados) ────────────────────────────────────
echo ""
echo "[1/2] Dump do banco (schema + dados)..."
DB_FILE="$DB_DIR/$DATA.sql.gz"

# --schema-only seria so estrutura; queremos tudo
# --no-owner / --no-acl removem refs a roles especificos do Supabase
# IMPORTANTE: NAO incluir o schema 'auth'. Ele contem hashes de senha, e-mails
# e tokens; como este dump e commitado no git (historico imutavel), incluir
# 'auth' vazaria credenciais permanentemente. Backup de usuarios do Auth deve
# ser feito por fora, em storage privado (nunca no repositorio).
pg_dump "$SUPABASE_DB_URL" \
  --no-owner \
  --no-acl \
  --schema=public \
  --exclude-schema=auth \
  --exclude-schema=storage \
  --exclude-schema=realtime \
  --exclude-schema=supabase_functions \
  --exclude-schema=vault \
  --exclude-schema=net \
  --quote-all-identifiers \
  | gzip > "$DB_FILE"

SIZE=$(du -h "$DB_FILE" | cut -f1)
echo "      OK: $DB_FILE ($SIZE)"

# Manter apenas os 30 backups mais recentes do banco (rotation)
echo "      Limpando backups com mais de 30 dias..."
ls -1t "$DB_DIR"/*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm -v

# ─── 2. Edge Functions (codigo fonte) ──────────────────────────────────────
echo ""
echo "[2/2] Baixando codigo das Edge Functions..."

# Login no CLI (usa SUPABASE_ACCESS_TOKEN automaticamente)
supabase link --project-ref "$SUPABASE_PROJECT_REF" --workdir /tmp/sb-link 2>&1 | tail -3 || true

# Lista das functions ativas
FUNCTIONS=$(supabase functions list --project-ref "$SUPABASE_PROJECT_REF" 2>/dev/null \
  | awk 'NR>3 && $1!="" && $1!~/^-/ {print $3}' \
  | grep -v '^$' || true)

if [ -z "$FUNCTIONS" ]; then
  echo "      AVISO: nenhuma function listada (continuando mesmo assim)"
else
  echo "      Functions encontradas: $(echo "$FUNCTIONS" | wc -l)"
fi

# Limpa diretorio antes de baixar (pra remover functions deletadas)
rm -rf "$FN_DIR"
mkdir -p "$FN_DIR"

for FN in $FUNCTIONS; do
  echo "      - $FN"
  mkdir -p "$FN_DIR/$FN"
  supabase functions download "$FN" \
    --project-ref "$SUPABASE_PROJECT_REF" \
    --output-dir "$FN_DIR/$FN" 2>&1 | tail -1 || echo "        (falha ao baixar $FN, continuando)"
done

# ─── 3. Manifest (resumo do backup) ────────────────────────────────────────
cat > "$ROOT/MANIFEST.md" <<EOF
# Backups Supabase — Brava Company

Ultimo backup automatico: **$DATA $(date -u +%H:%M) UTC**

Project ref: \`$SUPABASE_PROJECT_REF\`

## Conteudo

- \`database/YYYY-MM-DD.sql.gz\` — dump do schema public (SEM auth/storage/realtime), rotacao de 30 dias. O schema auth (hashes de senha) NAO e incluido de proposito, pois este dump vai pro git.
- \`edge-functions/<nome>/\` — codigo fonte de cada Edge Function

## Restauracao do banco

\`\`\`bash
gunzip -c backups/database/YYYY-MM-DD.sql.gz | psql "\$SUPABASE_DB_URL"
\`\`\`

## Restauracao de uma Edge Function

\`\`\`bash
supabase functions deploy <nome> \\
  --project-ref $SUPABASE_PROJECT_REF \\
  --file backups/edge-functions/<nome>/index.ts
\`\`\`

## Rodar backup manual

\`\`\`bash
export SUPABASE_DB_URL="postgresql://postgres.PROJREF:SENHA@..."
export SUPABASE_ACCESS_TOKEN="sbp_..."
export SUPABASE_PROJECT_REF="$SUPABASE_PROJECT_REF"
bash scripts/backup-supabase.sh
\`\`\`
EOF

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Backup concluido"
echo "  Banco:    $DB_FILE"
echo "  Functions: $FN_DIR/"
echo "═══════════════════════════════════════════════════════════════"
