# SecureChain Messenger

A blockchain and cryptography communication system that enables users to send encrypted messages recorded on blockchain for immutable verification, with a complete user interface supporting secure, decentralized communication.

## Features

- **End-to-End Encryption**: Messages are encrypted using AES-256-GCM or RSA-2048 encryption
- **Blockchain Verification**: Messages are stored on a blockchain-like structure for tamper-proof verification
- **User Management**: Add custom recipients with automatic cryptographic key generation
- **Real-time Updates**: Live blockchain log and message history with automatic refresh
- **Security Dashboard**: Monitor encryption statistics and network security metrics
- **Dark/Light Mode**: Toggle between themes with full UI support
- **Mining Simulation**: Mine blocks to verify pending messages

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite
- **Backend**: Express.js with TypeScript
- **Database**: In-memory storage (MemStorage) for development
- **Styling**: Tailwind CSS with shadcn/ui components
- **Cryptography**: Web Crypto API for client-side encryption
- **State Management**: TanStack Query for server state

## Prerequisites

- Node.js 18+ (or Node.js v 20.19.3 recommended otherwise port issue comes on windows)
- npm or yarn package manager
- Modern web browser with Web Crypto API support

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd securechain-messenger
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`    or http://127.0.0.1:5000/

## Windows-Specific Setup

### Option 1: Using npm (Recommended)
```cmd
# Install Node.js from https://nodejs.org/
# Open Command Prompt or PowerShell as Administrator

# Navigate to project directory
cd path\to\securechain-messenger

# Install dependencies
npm install

# Start the application
npm run dev   or try:   set NODE_ENV=development&& npx tsx server/index.ts
```

### Option 2: Using PowerShell
```powershell
# If you encounter execution policy issues, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then proceed with normal setup
npm install
npm run dev
```

### Option 3: Using Windows Subsystem for Linux (WSL)
```bash
# Install WSL2 and Ubuntu from Microsoft Store
# Then follow the regular Linux/Unix setup:
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
securechain-messenger/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility libraries
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # In-memory storage
├── shared/               # Shared types and schemas
└── README.md            # This file
```

## Usage Guide

### Getting Started

1. **Launch the application** - Navigate to `http://localhost:5000`
2. **Toggle theme** - Click the sun/moon icon in the header
3. **Add recipients** - Click "Add User" to create new users with crypto keys
4. **Send messages** - Select recipient, enter message, choose encryption method
5. **Mine blocks** - Click "Mine Block" to verify pending messages
6. **Monitor security** - View encryption stats in the security dashboard

### Default Test Users

The application comes with sample users for testing:
- alice (ID: 1)
- bob (ID: 2) 
- charlie (ID: 3)

### Encryption Methods

- **AES-256-GCM**: Symmetric encryption, faster for large messages
- **RSA-2048**: Asymmetric encryption, more secure key exchange

## API Endpoints

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/messages/user/:id` - Get messages for user
- `POST /api/messages` - Send new message
- `GET /api/blocks` - Get blockchain blocks
- `GET /api/blocks/latest` - Get latest block
- `POST /api/mine-block` - Mine a new block
- `GET /api/stats` - Get network statistics

## Security Features

- **Client-side encryption** - Messages encrypted in browser before sending
- **Hash verification** - SHA-256 hashing for message integrity
- **Blockchain simulation** - Immutable message storage
- **Key generation** - Automatic RSA/AES key pair generation
- **Address generation** - Unique blockchain addresses for users

## Troubleshooting

### Common Windows Issues

1. **Node.js not found**
   ```cmd
   # Download and install Node.js from https://nodejs.org/
   # Restart Command Prompt after installation
   ```

2. **Permission errors**
   ```cmd
   # Run Command Prompt as Administrator
   # Or use PowerShell with execution policy change
   ```

3. **Port already in use**
   ```cmd
   # Check what's using port 5000
   netstat -ano | findstr :5000
   # Kill the process or change port in vite.config.ts
   ```

4. **Build fails on Windows**
   ```cmd
   # Clear npm cache
   npm cache clean --force
   # Delete node_modules and reinstall
   rmdir /s node_modules
   npm install
   ```

### Common Development Issues

1. **Hot reload not working**
   - Ensure you're using `npm run dev` not `npm start`
   - Check if port 5000 is available

2. **TypeScript errors**
   - Run `npm run type-check` to see detailed errors
   - Ensure all dependencies are properly installed

3. **Crypto API not working**
   - Use HTTPS or localhost (required for Web Crypto API)
   - Ensure modern browser support

## Environment Variables

Create a `.env` file in the root directory for custom configuration:

```env
# Port for the server (default: 5000)
PORT=5000

# Database URL (if using persistent storage)
DATABASE_URL=your_database_url_here

# Environment
NODE_ENV=development
```

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to cloud platforms**
   - Replit: Click "Deploy" button
   - Vercel: Connect GitHub repository
   - Netlify: Deploy `dist` folder
   - Railway: Connect repository

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Note**: This is a development/demonstration project. For production use, implement proper authentication, persistent database storage, and additional security measures.