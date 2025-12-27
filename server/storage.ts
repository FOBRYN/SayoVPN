import { type VpnKey, type InsertVpnKey, vpnKeys } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createKey(data: InsertVpnKey): Promise<VpnKey>;
  getKeyByValue(key: string): Promise<VpnKey | undefined>;
  getKeysByTelegramUser(telegramUserId: string): Promise<VpnKey[]>;
  deactivateKey(key: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createKey(data: InsertVpnKey): Promise<VpnKey> {
    const [key] = await db.insert(vpnKeys).values(data).returning();
    return key;
  }

  async getKeyByValue(key: string): Promise<VpnKey | undefined> {
    const [result] = await db.select().from(vpnKeys).where(eq(vpnKeys.key, key));
    return result;
  }

  async getKeysByTelegramUser(telegramUserId: string): Promise<VpnKey[]> {
    return await db.select().from(vpnKeys).where(eq(vpnKeys.telegramUserId, telegramUserId));
  }

  async deactivateKey(key: string): Promise<void> {
    await db.update(vpnKeys).set({ isActive: false }).where(eq(vpnKeys.key, key));
  }
}

export const storage = new DatabaseStorage();
