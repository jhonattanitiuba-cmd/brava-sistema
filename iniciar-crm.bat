@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Sistema CRM
echo   http://localhost:3002
echo  ================================
echo.
cd /d "%~dp0crm"
npx serve . -p 3002 --no-clipboard
pause
