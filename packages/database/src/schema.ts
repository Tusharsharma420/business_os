import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Entities (People/Firms)
export const entities = sqliteTable('entities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  type: text('type', { enum: ['CLIENT', 'VENDOR', 'INTERNAL'] }).notNull(),
  email: text('email').unique(),
  password: text('password'), // Hashed password for users
  role: text('role', { enum: ['OWNER', 'ADMIN', 'STAFF'] }).default('STAFF'),
  phone: text('phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Catalog (Inventory/Services)
export const catalogItems = sqliteTable('catalog_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price: real('price').notNull(),
  type: text('type', { enum: ['PRODUCT', 'SERVICE'] }).notNull(),
  stockCount: real('stock_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Transactions (The Ledger)
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityId: text('entity_id').references(() => entities.id).notNull(),
  amount: real('amount').notNull(),
  currency: text('currency').default('USD').notNull(),
  description: text('description'),
  status: text('status', { enum: ['PENDING', 'COMPLETED', 'CANCELLED'] }).default('PENDING').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Transaction Items
export const transactionItems = sqliteTable('transaction_items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  transactionId: text('transaction_id').references(() => transactions.id).notNull(),
  catalogItemId: text('catalog_item_id').references(() => catalogItems.id).notNull(),
  quantity: real('quantity').notNull(),
  priceAtTime: real('price_at_time').notNull(),
});
