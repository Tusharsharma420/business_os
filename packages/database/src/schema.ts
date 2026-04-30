import { pgTable, uuid, text, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const entityTypeEnum = pgEnum('entity_type', ['CLIENT', 'VENDOR', 'INTERNAL']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'COMPLETED', 'CANCELLED']);
export const catalogItemTypeEnum = pgEnum('catalog_item_type', ['PRODUCT', 'SERVICE']);

export const entities = pgTable('entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: entityTypeEnum('type').notNull(),
  email: text('email'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const catalogItems = pgTable('catalog_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  type: catalogItemTypeEnum('type').notNull(),
  stockCount: text('stock_count'), // String to handle large numbers if needed, or int
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityId: uuid('entity_id').references(() => entities.id).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  description: text('description'),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Transaction Line Items (linking catalog to transactions)
export const transactionItems = pgTable('transaction_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  catalogItemId: uuid('catalog_item_id').references(() => catalogItems.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  priceAtTime: decimal('price_at_time', { precision: 12, scale: 2 }).notNull(),
});
