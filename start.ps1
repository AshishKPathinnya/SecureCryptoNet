# PowerShell start script for SecureChain Messenger

Write-Host "Starting SecureChain Messenger..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please run setup.ps1 first" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "ERROR: Dependencies not installed" -ForegroundColor Red
    Write-Host "Please run setup.ps1 first" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting the application..." -ForegroundColor Green
Write-Host "The application will be available at http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "Application stopped" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}