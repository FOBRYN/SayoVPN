import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vpnKeys = pgTable("vpn_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  telegramUserId: text("telegram_user_id").notNull(),
  telegramUsername: text("telegram_username"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVpnKeySchema = createInsertSchema(vpnKeys).pick({
  key: true,
  telegramUserId: true,
  telegramUsername: true,
});

export type InsertVpnKey = z.infer<typeof insertVpnKeySchema>;
export type VpnKey = typeof vpnKeys.$inferSelect;
