@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Pagina de Vendas
echo   http://localhost:3001
echo  ================================
echo.
cd /d "%~dp0lp"
npx serve . -p 3001 --no-clipboard
pause
