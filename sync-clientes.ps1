# ═══════════════════════════════════════════════════════════
# SYNC CLIENTES — copia sistemas de "3. SAAS/N. NOME/"
# para "0. SISTEMA DE HOSPEDAGEM/clientes/<slug>/"
# ═══════════════════════════════════════════════════════════
# Uso:
#   1. Edite os arquivos em 3. SAAS/N. NOME_CLIENTE/
#   2. Rode este script: ./sync-clientes.ps1
#   3. Faca git push -> deploy automatico no Cloudfy
# ═══════════════════════════════════════════════════════════

$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$source = Join-Path $root "3. SAAS"
$dest = Join-Path $PSScriptRoot "clientes"

# Mapeamento: pasta origem -> slug destino (slug usado nas URLs)
$mapping = @{
  "1. ALESSANDRO - SISTEMA IMOBILIÁRIO" = "alessandro"
  # Adicione novos clientes aqui quando tiverem sistema web proprio
  # "7. CLÍNICA REUNIDAS" = "clinicareunidas"
  # etc.
}

if (-not (Test-Path $dest)) {
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

$total = 0
foreach ($folderName in $mapping.Keys) {
  $slug = $mapping[$folderName]
  $srcPath = Join-Path $source $folderName
  $destPath = Join-Path $dest $slug

  if (-not (Test-Path $srcPath)) {
    Write-Host "PULAR (nao existe): $folderName" -ForegroundColor Yellow
    continue
  }

  New-Item -ItemType Directory -Path $destPath -Force | Out-Null

  # Copia tudo EXCETO FICHA_*.md (que e documentacao, fica em 3. SAAS)
  $copied = 0
  Get-ChildItem $srcPath -File | Where-Object { $_.Name -notlike "FICHA_*" } | ForEach-Object {
    Copy-Item $_.FullName -Destination $destPath -Force
    $copied++
  }
  Write-Host "OK $folderName  ->  clientes/$slug/  ($copied arquivos)" -ForegroundColor Green
  $total += $copied
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "SYNC COMPLETO: $total arquivos copiados" -ForegroundColor Cyan
Write-Host "Proximo passo: git add . && git commit && git push" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
