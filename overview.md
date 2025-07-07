# SecureCryptoNet Messenger

## Overview

SecureChain Messenger is a full-stack web application that combines blockchain technology with cryptographic messaging. It's built as a secure communication platform where messages are encrypted, hashed, and stored on a blockchain-like structure for integrity and security verification.

## System Architecture

### Full-Stack Architecture
- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state management

### Key Design Decisions
- **Monorepo Structure**: Uses a shared folder for database schemas and types, enabling type safety across frontend and backend
- **TypeScript-First**: Ensures type safety throughout the application
- **Modern React**: Uses functional components with hooks, no class components
- **Component Library**: Leverages shadcn/ui for consistent, accessible UI components

## Key Components

### Database Layer
- **Drizzle ORM**: Chosen for type-safe database operations and schema management
- **PostgreSQL**: Selected for reliability and ACID compliance needed for blockchain-like operations
- **Schema Design**: Three main tables - users, messages, and blocks

### Authentication & Security
- **Cryptographic Keys**: Each user has public/private key pairs for encryption
- **Web Crypto API**: Browser-native cryptography for client-side encryption
- **Multiple Encryption Methods**: Supports both AES-256-GCM and RSA-2048

### Blockchain Simulation
- **In-Memory Storage**: Currently uses MemStorage class for development
- **Block Mining**: Manual block creation with hash verification
- **Message Integrity**: Each message is hashed and can be verified

### Frontend Architecture
- **Component-Based**: Modular React components with clear separation of concerns
- **React Query**: Handles server state, caching, and real-time updates
- **Routing**: Uses Wouter for lightweight client-side routing
- **Form Management**: React Hook Form with Zod validation

## Data Flow

1. **User Registration**: Generate cryptographic key pairs, store user data
2. **Message Creation**: 
   - User composes message
   - Message is encrypted using chosen method
   - Message hash is generated for integrity
   - Message is stored with pending status
3. **Block Mining**: 
   - Pending messages are collected
   - New block is created with message data
   - Block hash is computed and verified
   - Messages are marked as verified
4. **Message Verification**: 
   - Hash verification ensures message integrity
   - Blockchain structure provides tamper evidence

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection for serverless deployment
- **@radix-ui/***: Accessible component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot module replacement for rapid development
- **Database Migrations**: Drizzle handles schema changes
- **Environment Variables**: Database URL and other secrets via .env

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Static Assets**: Frontend builds to dist/public
- **Server Bundle**: Backend compiles to single JS file
- **Database**: PostgreSQL with connection pooling

### Key Architectural Benefits
- **Type Safety**: Shared types between frontend and backend
- **Security**: Client-side encryption with server-side verification
- **Scalability**: Modular architecture allows easy feature additions
- **Developer Experience**: Hot reload, TypeScript, and modern tooling

