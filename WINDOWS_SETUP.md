# Windows Setup Guide for SecureChain Messenger

This guide will help you set up and run SecureChain Messenger on Windows.

## Prerequisites

1. **Install Node.js** (Required)
   - Download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - The installer will automatically add Node.js and npm to your PATH

2. **Choose Your Terminal** (Pick one)
   - **Command Prompt** (built into Windows)
   - **PowerShell** (built into Windows, more powerful)
   - **Git Bash** (if you have Git installed)
   - **Windows Terminal** (recommended, modern interface)

## Quick Setup (Easiest Method)

### Method 1: Using Batch Files (Double-click)
1. Download/extract the project folder
2. Double-click `setup.bat` to install dependencies
3. Double-click `start.bat` to run the application

### Method 2: Using PowerShell Scripts
1. Right-click in the project folder and select "Open PowerShell window here"
2. Run: `.\setup.ps1`
3. Run: `.\start.ps1`

## Manual Setup

### Step 1: Open Terminal
- **Command Prompt**: Press `Win + R`, type `cmd`, press Enter
- **PowerShell**: Press `Win + X`, select "Windows PowerShell"
- **Git Bash**: Right-click in folder, select "Git Bash Here"

### Step 2: Navigate to Project
```cmd
cd path\to\securechain-messenger
```

### Step 3: Install Dependencies
```cmd
npm install
```

### Step 4: Start Application

**Using Command Prompt:**
```cmd
set NODE_ENV=development&& npx tsx server/index.ts
```

**Using PowerShell:**
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

**Using Git Bash:**
```bash
NODE_ENV=development npx tsx server/index.ts
```

## Access the Application

Once started, open your web browser and go to:
```
http://localhost:5000
```

## Common Windows Issues & Solutions

### Issue 1: 'node' is not recognized
**Problem**: Node.js not in PATH
**Solution**: 
1. Reinstall Node.js from nodejs.org
2. Restart your terminal/computer
3. Verify with: `node --version`

### Issue 2: 'npm' is not recognized
**Problem**: npm not installed with Node.js
**Solution**: 
1. Reinstall Node.js (npm comes with it)
2. Or install npm separately: `npm install -g npm`

### Issue 3: PowerShell execution policy error
**Problem**: Cannot run PowerShell scripts
**Solution**: 
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 4: Port 5000 already in use
**Problem**: Another application using port 5000
**Solution**: 
1. Find what's using the port: `netstat -ano | findstr :5000`
2. Kill the process or use a different port

### Issue 5: ENOTSUP: operation not supported on socket
**Problem**: Windows doesn't support binding to 0.0.0.0
**Solution**: The server now automatically detects Windows and uses localhost instead

### Issue 6: Permission denied errors
**Problem**: Insufficient permissions
**Solution**: 
1. Run terminal as Administrator
2. Or change to a directory you have write access to

### Issue 7: Build fails with long path names
**Problem**: Windows path length limitation
**Solution**: 
1. Move project closer to root (e.g., `C:\projects\`)
2. Or enable long path support in Windows 10/11

## Development Tips for Windows

### Hot Reload
The development server automatically reloads when you make changes to files.

### Stopping the Server
Press `Ctrl + C` in the terminal to stop the development server.

### Environment Variables
Create a `.env` file in the project root for custom settings:
```
PORT=5000
NODE_ENV=development
```

### IDE Recommendations
- **Visual Studio Code** (free, excellent TypeScript support)
- **WebStorm** (paid, full-featured)
- **Notepad++** (free, lightweight)

## Building for Production

### Build the application:
```cmd
npm run build
```

### Start production server:
**Command Prompt:**
```cmd
set NODE_ENV=production&& node dist/index.js
```

**PowerShell:**
```powershell
$env:NODE_ENV="production"; node dist/index.js
```

## Troubleshooting

If you encounter any issues:

1. **Clear npm cache:**
   ```cmd
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```cmd
   rmdir /s node_modules
   npm install
   ```

3. **Check Node.js version:**
   ```cmd
   node --version
   npm --version
   ```

4. **Verify project structure:**
   Make sure you have these files:
   - `package.json`
   - `server/index.ts`
   - `client/` folder
   - `node_modules/` folder (after npm install)

## Getting Help

- Check the main `README.md` for general documentation
- Look at `windows-scripts.md` for Windows-specific commands
- Create an issue on GitHub if you encounter problems
- Ensure you're using Node.js 18+ for best compatibility

## Next Steps

Once the application is running:
1. Open http://localhost:5000 in your browser
2. Try the dark/light mode toggle
3. Add a new user with the "Add User" button
4. Send an encrypted message
5. Mine a block to verify messages

Happy coding! 🚀