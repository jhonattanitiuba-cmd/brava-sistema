@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — SaaS Dashboard
echo   http://localhost:3004
echo  ================================
echo.
cd /d "%~dp0saas"
npx serve . -p 3004 --no-clipboard
pause
