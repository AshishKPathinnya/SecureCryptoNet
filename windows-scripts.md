# Windows-Specific Scripts

Since we cannot modify package.json directly, here are Windows-compatible alternatives to the npm scripts:

## Development

### Start Development Server (Windows)
```cmd
set NODE_ENV=development&& npx tsx server/index.ts
```

Or use PowerShell:
```powershell
$env:NODE_ENV="development"; npx tsx server/index.ts
```

**Note**: The server automatically detects Windows and uses `127.0.0.1` (IPv4) instead of `0.0.0.0` or `::1` for better compatibility.

### Build for Production (Windows)
```cmd
npm run build
```
(This works the same on Windows)

### Start Production Server (Windows)
```cmd
set NODE_ENV=production&& node dist/index.js
```

Or use PowerShell:
```powershell
$env:NODE_ENV="production"; node dist/index.js
```

## Type Checking
```cmd
npx tsc --noEmit
```

## Clean Build Files (Windows)
```cmd
rmdir /s /q dist
rmdir /s /q node_modules\.cache
```

Or use PowerShell:
```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

## Quick Setup Commands

### Using Command Prompt:
```cmd
# Install dependencies
npm install

# Start development
set NODE_ENV=development&& npx tsx server/index.ts
```

### Using PowerShell:
```powershell
# Install dependencies
npm install

# Start development
$env:NODE_ENV="development"; npx tsx server/index.ts
```

## Batch Files Included

The project includes these batch files for easier Windows usage:

- `setup.bat` - Install dependencies
- `start.bat` - Start the development server
- `setup.ps1` - PowerShell setup script
- `start.ps1` - PowerShell start script

Simply double-click these files or run them from Command Prompt/PowerShell.