# Start all servers for BG Remover project

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting all servers..." -ForegroundColor Cyan

# AI Server (Python/FastAPI) - port 8000
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\ai-server'; python main.py" -WindowStyle Normal

# Backend (Node/Express) - port 5000
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; node server.js" -WindowStyle Normal

# Frontend (Vite/React) - port 5173
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "All servers launched in separate windows!" -ForegroundColor Green
Write-Host "  AI Server  -> http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Backend    -> http://localhost:5000" -ForegroundColor Yellow
Write-Host "  Frontend   -> http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open your browser at http://localhost:5173" -ForegroundColor Cyan
