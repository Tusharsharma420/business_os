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
  type: text("type").$type<'product' | 'service'>().notNull(),
  price: real("price").notNull(),
  stock: real("stock").default(0),
  unit: text("unit").default('unit'),
  description: text("description"),
  imageUrl: text("imageUrl"), // Added image support
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["IN", "OUT"] }).notNull(),
  amount: real("amount").notNull(), // Total after discount & tax
  contactId: text("contact_id").references(() => contacts.id),
  lineItems: text("line_items"), // JSON string: { itemId, name, qty, price, discount, tax }[]
  discount: real("discount").default(0),
  tax: real("tax").notNull().default(0),
  status: text("status", { enum: ["paid", "pending", "overdue"] }).default("paid"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const business_identity = sqliteTable("business_identity", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  taxId: text("tax_id"),
  currency: text("currency").default("₹"),
  address: text("address"),
  email: text("email"),
  phone: text("phone"),
});
