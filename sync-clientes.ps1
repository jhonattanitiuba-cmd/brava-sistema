# ═══════════════════════════════════════════════════════════
# SYNC CLIENTES — copia sistemas e logos das pastas organizacionais
# para as pastas de deploy.
# ═══════════════════════════════════════════════════════════
# Uso:
#   1. Edite arquivos em "3. SAAS/N. NOME_CLIENTE/"
#   2. Coloque logos em "3. SAAS/N. NOME/LOGO/logo.png"
#   3. Rode: ./sync-clientes.ps1
#   4. git add . && git commit && git push  -> deploy automatico
# ═══════════════════════════════════════════════════════════

$root = Split-Path $PSScriptRoot -Parent
$source = Join-Path $root "3. SAAS"
$destSys = Join-Path $PSScriptRoot "clientes"
$destLogos = Join-Path $destSys "_logos"

# Mapeamento pasta origem -> slug destino
$mapping = @{
  "1. ALESSANDRO - SISTEMA IMOBILIÁRIO" = "alessandro"
  "7. CLÍNICA REUNIDAS"                  = "clinicareunidas"
  "12. GARCIA SADLER"                    = "garciasadler"
  "9. DRA. THALITA MORETE"               = "thalita"
  "16. LDCCELL SOROCABA"                 = "ldccell"
  "25. VAPOCAMPING HOTEL"                = "vapocamping"
  "ESTACIONEPARK"                        = "estacionepark"
  "19. MASTER AVIAÇÃO"                   = "masteraviacao"
}

if (-not (Test-Path $destSys)) { New-Item -ItemType Directory -Path $destSys -Force | Out-Null }
if (-not (Test-Path $destLogos)) { New-Item -ItemType Directory -Path $destLogos -Force | Out-Null }

$sysCopied = 0
$logosCopied = 0

foreach ($folderName in $mapping.Keys) {
  $slug = $mapping[$folderName]
  $srcPath = Join-Path $source $folderName

  if (-not (Test-Path $srcPath)) {
    Write-Host "PULAR (nao existe): $folderName" -ForegroundColor Yellow
    continue
  }

  # 1. SINCRONIZA SISTEMA (arquivos web da raiz da pasta do cliente)
  $destSysPath = Join-Path $destSys $slug
  $sysFiles = Get-ChildItem $srcPath -File | Where-Object {
    $_.Name -notlike "FICHA_*" -and $_.Extension -in '.html','.css','.js','.json','.png','.jpg','.jpeg','.svg','.webp'
  }
  if ($sysFiles.Count -gt 0) {
    New-Item -ItemType Directory -Path $destSysPath -Force | Out-Null
    foreach ($f in $sysFiles) {
      Copy-Item $f.FullName -Destination $destSysPath -Force
      $sysCopied++
    }
    Write-Host "Sistema: $folderName -> clientes/$slug/ ($($sysFiles.Count) arquivos)" -ForegroundColor Green
  }

  # 2. SINCRONIZA LOGO (pega da subpasta LOGO/)
  $logoSrc = Join-Path $srcPath "LOGO"
  if (Test-Path $logoSrc) {
    $logoFiles = Get-ChildItem $logoSrc -File | Where-Object {
      $_.Name -notlike "README*" -and $_.Extension -in '.png','.jpg','.jpeg','.svg','.webp','.ico'
    }
    foreach ($f in $logoFiles) {
      # Renomeia logo.png -> <slug>.png, logo.svg -> <slug>.svg, etc.
      $newName = if ($f.BaseName -eq "logo") { "$slug$($f.Extension)" } else { "$slug-$($f.Name)" }
      $destPath = Join-Path $destLogos $newName
      Copy-Item $f.FullName -Destination $destPath -Force
      Write-Host "Logo: $folderName/LOGO/$($f.Name) -> _logos/$newName" -ForegroundColor Cyan
      $logosCopied++
    }
  }
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "SISTEMAS: $sysCopied arquivos" -ForegroundColor Cyan
Write-Host "LOGOS:    $logosCopied arquivos" -ForegroundColor Cyan
Write-Host "Proximo: git add . && git commit && git push" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
