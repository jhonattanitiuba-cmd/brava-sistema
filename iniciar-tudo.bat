@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Subindo tudo
echo  ================================
echo.
echo  LP       → http://localhost:3001
echo  App      → http://localhost:3002
echo  Checkout → http://localhost:3003
echo  Admin    → http://localhost:3004
echo.

start "LP - Brava" cmd /k "cd /d "%~dp0lp" && npx serve . -p 3001 --no-clipboard"
timeout /t 2 /nobreak >nul
start "App - Brava" cmd /k "cd /d "%~dp0app" && npx serve . -p 3002 --no-clipboard"
timeout /t 2 /nobreak >nul
start "Checkout - Brava" cmd /k "cd /d "%~dp0checkout" && npx serve . -p 3003 --no-clipboard"
timeout /t 2 /nobreak >nul
start "Admin - Brava" cmd /k "cd /d "%~dp0admin" && npx serve . -p 3004 --no-clipboard"
timeout /t 3 /nobreak >nul

start http://localhost:3001

echo  Todos os servidores rodando. Feche as janelas de terminal para parar.
pause
