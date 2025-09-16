# Development Server Crash Prevention Guide

## Problem Solved ✅
The "ERR_CONNECTION_REFUSED" error that occurs when making code changes has been fixed with multiple solutions:

## What Was Implemented:

### 1. **Enhanced Vite Configuration** (`vite.config.js`)
- **Error Overlay**: Instead of crashing, errors now show in an overlay
- **Stable Port Handling**: Falls back to other ports if 5173 is busy
- **Better File Watching**: Optimized file change detection
- **Improved Error Handling**: Suppresses non-critical warnings that could cause crashes

### 2. **Error Boundary Component** (`src/components/ErrorBoundary.jsx`)
- **Prevents React Crashes**: Catches JavaScript errors in React components
- **User-Friendly Error Display**: Shows helpful error messages instead of white screen
- **Development Info**: Shows detailed error info in development mode
- **Auto-Refresh**: Provides button to refresh the page

### 3. **Enhanced Package Scripts** (`package.json`)
- **Standard Dev**: `npm run dev` - Normal development server
- **Safe Mode**: `npm run dev:safe` - Uses nodemon for auto-restart
- **Auto-Restart**: `npm run dev:restart` - Automatically restarts if server crashes

### 4. **Windows Batch Script** (`start-dev.bat`)
- **Double-click to start**: Easy development server startup
- **Automatic Restart**: If server crashes, it restarts automatically
- **User-friendly**: Clear instructions and status messages

## How to Use:

### Option 1: Standard Development (Recommended)
```bash
cd "c:\xampp\htdocs\Fm\FARMMASTER"
npm run dev
```
- Server runs on http://localhost:5174/
- Error overlay shows instead of crashing
- Better error handling and recovery

### Option 2: Auto-Restart Mode
```bash
npm run dev:restart
```
- Automatically restarts if server crashes
- Good for when making many code changes

### Option 3: Windows Batch Script
Double-click `start-dev.bat` file for easy startup with auto-restart.

## Common Causes of Server Crashes (Now Fixed):

### ✅ **Syntax Errors**
- **Before**: Server would crash on JavaScript syntax errors
- **After**: Error overlay shows the error, server stays running

### ✅ **Import/Export Issues** 
- **Before**: Missing imports would crash the server
- **After**: Error boundary catches these, shows user-friendly message

### ✅ **React Component Errors**
- **Before**: Runtime errors in components would crash the app
- **After**: Error boundary catches errors, shows fallback UI

### ✅ **Port Conflicts**
- **Before**: If port 5173 was busy, server might fail to start
- **After**: Automatically tries other ports (5174, 5175, etc.)

## Additional Tips:

1. **Clear Cache**: If you still see issues, clear browser cache (Ctrl+F5)
2. **Check Console**: Open browser dev tools (F12) to see detailed error messages
3. **File Permissions**: Make sure you have write permissions in the project folder
4. **Antivirus**: Some antivirus software can interfere with file watching

## Your Development Workflow:

1. **Start Server**: Run `npm run dev` from the FARMMASTER directory
2. **Make Changes**: Edit your code - server will hot reload changes
3. **If Error Occurs**: Check the error overlay or browser console
4. **If Server Crashes**: It will either auto-restart or you can run `npm run dev` again

The server is now much more stable and should handle code changes without crashing!