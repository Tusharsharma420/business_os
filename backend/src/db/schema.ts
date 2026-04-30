import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["customer", "vendor", "partner"] }).notNull(),
  phone: text("phone"),
  email: text("email"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["product", "service"] }).notNull(),
  price: real("price").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["IN", "OUT"] }).notNull(),
  amount: real("amount").notNull(),
  contactId: text("contact_id").references(() => contacts.id),
  itemId: text("item_id").references(() => items.id),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
