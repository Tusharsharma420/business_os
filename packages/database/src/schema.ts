import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

// Identity & People
export const entities = sqliteTable('entities', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  type: text('type', { enum: ['CLIENT', 'SUPPLIER', 'INTERNAL'] }).default('CLIENT'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Chart of Accounts
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  type: text('type', { enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'] }).notNull(),
  description: text('description'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Core Transactions (Master Record)
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  date: text('date').notNull().$defaultFn(() => new Date().toISOString()),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  metadata: text('metadata'), // JSON string
  createdBy: text('created_by').references(() => entities.id),
});

// Ledger Entries (Double-Entry lines)
export const ledgerEntries = sqliteTable('ledger_entries', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  transactionId: text('transaction_id').notNull().references(() => transactions.id),
  accountId: text('account_id').notNull().references(() => accounts.id),
  debit: real('debit').default(0),
  credit: real('credit').default(0),
  date: text('date').notNull().$defaultFn(() => new Date().toISOString()),
});

// Product/Service Catalog
export const catalog = sqliteTable('catalog', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  price: real('price').notNull(),
  sku: text('sku'),
  description: text('description'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});
