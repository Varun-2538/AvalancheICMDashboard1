Write-Host "Setting up Avalanche ICM Dashboard..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers:" -ForegroundColor Cyan
Write-Host "1. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The backend will run on http://localhost:3001" -ForegroundColor White
Write-Host "The frontend will run on http://localhost:3000" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
