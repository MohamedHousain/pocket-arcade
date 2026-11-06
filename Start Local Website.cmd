@echo off
cd /d "%~dp0dist"
echo Pocket Arcade: http://localhost:8080
echo Keep this window open while playing. Press Ctrl+C to stop the server.
python -m http.server 8080 --bind 127.0.0.1
pause
