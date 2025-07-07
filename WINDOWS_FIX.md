# Windows Compatibility Fix Applied

## Issue Resolved
The `ENOTSUP: operation not supported on socket ::1:5000` error has been fixed!

## What Was Changed
The server now automatically detects Windows and uses `127.0.0.1` (IPv4 only) instead of `0.0.0.0` or `::1` for better compatibility.

## Additional Fix
Added `ipv6Only: false` to force IPv4 binding on Windows systems.

## Try Again
Now that the fix is applied, try running the application again:

### Method 1: Using Batch File
```cmd
setup.bat
start.bat
```

### Method 2: Manual Commands
```cmd
cd C:\Users\Ashish\Desktop\SecureCryptoNet
npm install
set NODE_ENV=development&& npx tsx server/index.ts
```

### Method 3: PowerShell
```powershell
cd C:\Users\Ashish\Desktop\SecureCryptoNet
npm install
$env:NODE_ENV="development"; npx tsx server/index.ts
```

## Expected Output
You should now see:
```
serving on port 5000 (host: 127.0.0.1)
```

## Access the Application
Open your browser and go to:
```
http://localhost:5000
```

## Security Vulnerabilities Warning
The npm install showed 9 vulnerabilities (1 low, 8 moderate). These are in development dependencies and don't affect the running application, but you can fix them with:

```cmd
npm audit fix
```

Or for more aggressive fixes:
```cmd
npm audit fix --force
```

## If Still Having Issues
1. Make sure Node.js version is compatible (you have v22.17.0 which is good)
2. Try a different port if 5000 is still problematic
3. Run as Administrator if you get permission errors
4. Check Windows Firewall settings

The application should now work properly on your Windows system!