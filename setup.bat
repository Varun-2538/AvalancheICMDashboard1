@echo off
echo Setting up Avalanche ICM Dashboard...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo To start the development servers:
echo 1. Start backend: cd backend && npm run dev
echo 2. Start frontend: cd frontend && npm run dev
echo.
echo The backend will run on http://localhost:3001
echo The frontend will run on http://localhost:3000
echo.
pause
