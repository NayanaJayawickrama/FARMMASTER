# Enhanced Development Server Startup Script for FarmMaster
# This script provides better stability and crash recovery

Write-Host "Starting FarmMaster Development Server with Enhanced Stability..." -ForegroundColor Green
Write-Host ""
Write-Host "Features:" -ForegroundColor Cyan
Write-Host "- Automatic restart on crash" -ForegroundColor White
Write-Host "- WebSocket connection recovery" -ForegroundColor White
Write-Host "- Better error handling" -ForegroundColor White
Write-Host "- Process cleanup" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop completely." -ForegroundColor Yellow
Write-Host ""

# Change to the correct directory
Set-Location "c:\xampp\htdocs\Fm\FARMMASTER"

# Function to clean up processes and cache
function Cleanup {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Cleaning up processes and cache..." -ForegroundColor Yellow
    
    # Kill any hanging Node.js processes
    try {
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    } catch {}
    
    # Clean up Vite cache
    if (Test-Path ".vite") {
        Remove-Item ".vite" -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "node_modules\.vite") {
        Remove-Item "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Start-Sleep -Seconds 1
}

# Main loop
$restartCount = 0
while ($true) {
    $restartCount++
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting development server (Attempt: $restartCount)..." -ForegroundColor Green
    
    # Cleanup before starting
    if ($restartCount -gt 1) {
        Cleanup
    }
    
    # Start the development server
    try {
        & npm run dev
        $exitCode = $LASTEXITCODE
        
        if ($exitCode -eq 0) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Server stopped normally." -ForegroundColor Green
        } else {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Server crashed with exit code: $exitCode" -ForegroundColor Red
        }
    } catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Server crashed with exception: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Restarting in 3 seconds..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop auto-restart." -ForegroundColor Yellow
    
    try {
        Start-Sleep -Seconds 3
    } catch [System.Management.Automation.PipelineStoppedException] {
        Write-Host "Stopping auto-restart..." -ForegroundColor Yellow
        break
    }
}

Write-Host "Development server stopped." -ForegroundColor Green