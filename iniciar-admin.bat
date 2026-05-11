@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Admin (Painel)
echo   http://localhost:3004
echo  ================================
echo.
cd /d "%~dp0admin"
npx serve . -p 3004 --no-clipboard
pause
