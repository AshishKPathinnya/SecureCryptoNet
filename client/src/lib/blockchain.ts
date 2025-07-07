import { apiRequest } from "./queryClient";
import { cryptoService } from "./crypto";
import type { Block, Message } from "@shared/schema";

export class BlockchainService {
  private static instance: BlockchainService;

  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  async mineBlock(): Promise<Block> {
    const response = await apiRequest("POST", "/api/mine-block");
    return response.json();
  }

  async getBlocks(): Promise<Block[]> {
    const response = await apiRequest("GET", "/api/blocks");
    return response.json();
  }

  async getLatestBlock(): Promise<Block> {
    const response = await apiRequest("GET", "/api/blocks/latest");
    return response.json();
  }

  async addMessageToBlockchain(message: Message): Promise<void> {
    // Messages are automatically added to pending queue
    // They will be included in the next mined block
  }

  async verifyMessageHash(content: string, hash: string): Promise<boolean> {
    const computedHash = await cryptoService.generateHash(content);
    return computedHash === hash;
  }

  async generateBlockHash(
    previousHash: string,
    timestamp: string,
    messageCount: number,
    nonce: number
  ): Promise<string> {
    const blockString = `${previousHash}${timestamp}${messageCount}${nonce}`;
    return await cryptoService.generateHash(blockString);
  }

  formatBlockHash(hash: string): string {
    if (hash.startsWith("0x")) {
      return hash;
    }
    return `0x${hash}`;
  }

  formatAddress(address: string): string {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  getBlockExplorerUrl(blockHash: string): string {
    // For a real blockchain, this would link to a block explorer
    return `#/block/${blockHash}`;
  }
}

export const blockchainService = BlockchainService.getInstance();
