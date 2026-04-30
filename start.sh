#!/bin/bash

echo "========================================"
echo "  NEPFLIX API SERVER - Quick Start"
echo "========================================"
echo ""

cd api

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting Nepflix API Server..."
echo ""
echo "Dashboard: http://localhost:3000/api/dashboard.html"
echo "Target API: http://localhost:3000/api/"
echo "Visitors API: http://localhost:3000/api/visitors"
echo ""

npm start
