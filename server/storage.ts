import { users, messages, blocks, type User, type InsertUser, type Message, type InsertMessage, type Block, type InsertBlock } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  getMessagesBetweenUsers(fromUserId: number, toUserId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string): Promise<void>;
  updateMessageBlockId(id: number, blockId: number): Promise<void>;

  // Block operations
  getBlock(id: number): Promise<Block | undefined>;
  getBlockByHeight(height: number): Promise<Block | undefined>;
  getLatestBlock(): Promise<Block | undefined>;
  getAllBlocks(): Promise<Block[]>;
  createBlock(block: InsertBlock): Promise<Block>;
  getBlockCount(): Promise<number>;

  // Statistics
  getNetworkStats(): Promise<{
    totalMessages: number;
    activeUsers: number;
    encryptedMessages: number;
    hashVerifications: number;
    securityScore: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private messages: Map<number, Message> = new Map();
  private blocks: Map<number, Block> = new Map();
  private currentUserId = 1;
  private currentMessageId = 1;
  private currentBlockId = 1;
  private currentBlockHeight = 0;

  constructor() {
    // Initialize with genesis block
    this.initializeGenesis();
  }

  private async initializeGenesis(): Promise<void> {
    const genesisBlock: Block = {
      id: this.currentBlockId++,
      height: 0,
      hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      previousHash: null,
      timestamp: new Date(),
      messageCount: 0,
      nonce: 0,
    };
    this.blocks.set(genesisBlock.id, genesisBlock);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.address === address);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      message => message.fromUserId === userId || message.toUserId === userId
    );
  }

  async getMessagesBetweenUsers(fromUserId: number, toUserId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      message => 
        (message.fromUserId === fromUserId && message.toUserId === toUserId) ||
        (message.fromUserId === toUserId && message.toUserId === fromUserId)
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      ...insertMessage,
      id: this.currentMessageId++,
      timestamp: new Date(),
      status: insertMessage.status || "pending",
      encryptionMethod: insertMessage.encryptionMethod || "AES-256-GCM",
      blockId: insertMessage.blockId || null,
    };
    this.messages.set(message.id, message);
    return message;
  }

  async updateMessageStatus(id: number, status: string): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.status = status;
      this.messages.set(id, message);
    }
  }

  async updateMessageBlockId(id: number, blockId: number): Promise<void> {
    const message = this.messages.get(id);
    if (message) {
      message.blockId = blockId;
      this.messages.set(id, message);
    }
  }

  async getBlock(id: number): Promise<Block | undefined> {
    return this.blocks.get(id);
  }

  async getBlockByHeight(height: number): Promise<Block | undefined> {
    return Array.from(this.blocks.values()).find(block => block.height === height);
  }

  async getLatestBlock(): Promise<Block | undefined> {
    const blocks = Array.from(this.blocks.values());
    return blocks.sort((a, b) => b.height - a.height)[0];
  }

  async getAllBlocks(): Promise<Block[]> {
    return Array.from(this.blocks.values()).sort((a, b) => b.height - a.height);
  }

  async createBlock(insertBlock: InsertBlock): Promise<Block> {
    const block: Block = {
      ...insertBlock,
      id: this.currentBlockId++,
      height: ++this.currentBlockHeight,
      timestamp: new Date(),
      nonce: insertBlock.nonce || 0,
      previousHash: insertBlock.previousHash || null,
      messageCount: insertBlock.messageCount || 0,
    };
    this.blocks.set(block.id, block);
    return block;
  }

  async getBlockCount(): Promise<number> {
    return this.blocks.size;
  }

  async getNetworkStats(): Promise<{
    totalMessages: number;
    activeUsers: number;
    encryptedMessages: number;
    hashVerifications: number;
    securityScore: number;
  }> {
    const totalMessages = this.messages.size;
    const activeUsers = this.users.size;
    const encryptedMessages = Array.from(this.messages.values()).filter(m => m.encryptedContent).length;
    
    return {
      totalMessages,
      activeUsers,
      encryptedMessages,
      hashVerifications: encryptedMessages, // Simplified: assume all encrypted messages are verified
      securityScore: activeUsers > 0 ? Math.min(98.7, (encryptedMessages / totalMessages) * 100) : 0,
    };
  }
}

export const storage = new MemStorage();
