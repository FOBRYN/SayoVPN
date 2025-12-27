import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

function generateVlessKey(): string {
  const uuid = crypto.randomUUID();
  return `vless://${uuid}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create a new VPN key (called by Telegram bot)
  app.post("/api/keys", async (req, res) => {
    try {
      const schema = z.object({
        telegramUserId: z.string(),
        telegramUsername: z.string().optional(),
      });
      
      const data = schema.parse(req.body);
      const key = generateVlessKey();
      
      const vpnKey = await storage.createKey({
        key,
        telegramUserId: data.telegramUserId,
        telegramUsername: data.telegramUsername || null,
      });
      
      res.json({ success: true, key: vpnKey.key });
    } catch (error) {
      console.error("Error creating key:", error);
      res.status(400).json({ success: false, error: "Invalid request" });
    }
  });

  // Validate a VPN key (called by VPN app)
  app.post("/api/keys/validate", async (req, res) => {
    try {
      const schema = z.object({
        key: z.string(),
      });
      
      const { key } = schema.parse(req.body);
      const vpnKey = await storage.getKeyByValue(key);
      
      if (vpnKey && vpnKey.isActive) {
        res.json({ valid: true, key: vpnKey.key });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      console.error("Error validating key:", error);
      res.status(400).json({ valid: false, error: "Invalid request" });
    }
  });

  // Get key info (public endpoint)
  app.get("/api/keys/:key", async (req, res) => {
    try {
      const vpnKey = await storage.getKeyByValue(req.params.key);
      
      if (vpnKey && vpnKey.isActive) {
        res.json({ 
          valid: true, 
          createdAt: vpnKey.createdAt 
        });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      res.status(500).json({ valid: false });
    }
  });

  return httpServer;
}
