@echo off

REM Terminal 1: Frontend dev server
start "Frontend Server" cmd /k "npm run dev"

REM Terminal 2: Backend server
start "Backend Server" cmd /k "cd backend && python main.py"

exit