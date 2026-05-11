@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Checkout
echo   http://localhost:3003
echo  ================================
echo.
cd /d "%~dp0checkout"
npx serve . -p 3003 --no-clipboard
pause
