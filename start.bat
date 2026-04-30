@echo off
echo ========================================
echo   NEPFLIX API SERVER - Quick Start
echo ========================================
echo.

cd api

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Nepflix API Server...
echo.
echo Dashboard: http://localhost:3000/api/dashboard.html
echo Target API: http://localhost:3000/api/
echo Visitors API: http://localhost:3000/api/visitors
echo.

call npm start
