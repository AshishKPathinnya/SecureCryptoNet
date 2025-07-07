import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  address: text("address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  content: text("content").notNull(),
  encryptedContent: text("encrypted_content").notNull(),
  messageHash: text("message_hash").notNull(),
  encryptionMethod: text("encryption_method").notNull().default("AES-256-GCM"),
  blockId: integer("block_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, delivered, verified
});

export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  height: integer("height").notNull().unique(),
  hash: text("hash").notNull().unique(),
  previousHash: text("previous_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
  messageCount: integer("message_count").notNull().default(0),
  nonce: integer("nonce").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertBlockSchema = createInsertSchema(blocks).omit({
  id: true,
  timestamp: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Block = typeof blocks.$inferSelect;
export type InsertBlock = z.infer<typeof insertBlockSchema>;
