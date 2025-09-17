@echo off
echo Starting FarmMaster Development Server with Enhanced Stability...
echo.
echo Features:
echo - Automatic restart on crash
echo - WebSocket connection recovery
echo - Better error handling
echo.
echo Press Ctrl+C twice to stop completely.
echo.

cd /d "c:\xampp\htdocs\Fm\FARMMASTER"

:restart
echo [%time%] Starting development server...
echo.

REM Kill any existing Node.js processes that might be hanging
taskkill /F /IM node.exe 2>nul >nul

REM Clean up any cached files that might cause issues
if exist ".vite" rmdir /S /Q ".vite" 2>nul
if exist "node_modules\.vite" rmdir /S /Q "node_modules\.vite" 2>nul

REM Start the development server
npm run dev

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo [%time%] Server stopped normally.
) else (
    echo [%time%] Server crashed with error code %ERRORLEVEL%.
)

echo.
echo [%time%] Restarting in 3 seconds...
echo Press Ctrl+C to stop auto-restart.
timeout /t 3 /nobreak > nul
goto restart