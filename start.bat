@echo off
cd /d "%~dp0"
echo Сайт САМ·АМ: http://127.0.0.1:5173
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:5173"
node server.js
pause
