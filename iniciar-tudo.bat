@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Subindo tudo
echo  ================================
echo.
echo  LP   → http://localhost:3001
echo  CRM  → http://localhost:3002
echo.

start "LP - Brava" cmd /k "cd /d "%~dp0lp" && npx serve . -p 3001 --no-clipboard"
timeout /t 2 /nobreak >nul
start "CRM - Brava" cmd /k "cd /d "%~dp0crm" && npx serve . -p 3002 --no-clipboard"
timeout /t 3 /nobreak >nul

start http://localhost:3001
start http://localhost:3002

echo  Ambos os servidores rodando. Feche as janelas de terminal para parar.
pause
