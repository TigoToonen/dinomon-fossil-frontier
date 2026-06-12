@echo off
rem ── DinoMon: Fossil Frontier — lokale server + browser ──
rem Dubbelklik dit bestand om de game te spelen op http://localhost:8080
cd /d "%~dp0"
start "" http://localhost:8080
python -m http.server 8080
