@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — App (CRM/Login)
echo   http://localhost:3002
echo  ================================
echo.
cd /d "%~dp0app"
npx serve . -p 3002 --no-clipboard
pause
