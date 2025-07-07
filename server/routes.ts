import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMessageSchema, insertBlockSchema } from "@shared/schema";
import { createHash } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/messages/user/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByUser(parseInt(req.params.userId));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/messages/between/:fromUserId/:toUserId", async (req, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(
        parseInt(req.params.fromUserId),
        parseInt(req.params.toUserId)
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/messages/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateMessageStatus(parseInt(req.params.id), status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Block routes
  app.post("/api/blocks", async (req, res) => {
    try {
      const blockData = insertBlockSchema.parse(req.body);
      const block = await storage.createBlock(blockData);
      res.json(block);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/blocks", async (req, res) => {
    try {
      const blocks = await storage.getAllBlocks();
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/blocks/latest", async (req, res) => {
    try {
      const block = await storage.getLatestBlock();
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mining/Block creation endpoint
  app.post("/api/mine-block", async (req, res) => {
    try {
      const pendingMessages = Array.from((storage as any).messages.values())
        .filter(msg => msg.status === "pending" && !msg.blockId);
      
      const latestBlock = await storage.getLatestBlock();
      const previousHash = latestBlock?.hash || "0x0000000000000000000000000000000000000000000000000000000000000000";
      
      // Simple proof of work - find hash starting with zeros
      let nonce = 0;
      let hash = "";
      const timestamp = new Date().toISOString();
      
      do {
        nonce++;
        const blockString = `${previousHash}${timestamp}${pendingMessages.length}${nonce}`;
        hash = "0x" + createHash("sha256").update(blockString).digest("hex");
      } while (!hash.startsWith("0x000")); // Simple difficulty
      
      const newBlock = await storage.createBlock({
        hash,
        previousHash,
        messageCount: pendingMessages.length,
        nonce,
      });

      // Update message statuses and block references
      for (const message of pendingMessages) {
        await storage.updateMessageBlockId(message.id, newBlock.id);
        await storage.updateMessageStatus(message.id, "verified");
      }

      res.json(newBlock);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getNetworkStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hash generation endpoint
  app.post("/api/hash", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({ error: "Data is required" });
      }
      
      const hash = createHash("sha256").update(data).digest("hex");
      res.json({ hash: "0x" + hash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
