@echo off
echo.
echo  ================================
echo   BRAVA COMPANY — Sistema completo
echo  ================================
echo.
echo  LP    -^> http://localhost:3001
echo  App   -^> http://localhost:3001/app
echo  Admin -^> http://localhost:3001/admin
echo.

cd /d "%~dp0"
start "Brava Sistema" cmd /k "npx serve . -p 3001 --no-clipboard"
timeout /t 3 /nobreak >nul
start http://localhost:3001
pause
