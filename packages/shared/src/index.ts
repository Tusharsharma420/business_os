export type EntityType = 'CLIENT' | 'SUPPLIER' | 'INTERNAL';

export interface Entity {
  id: string;
  name: string;
  email: string;
  type: EntityType;
  createdAt: string;
}

// Accounting Primitives
export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  metadata?: Record<string, any>;
}

export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountId: string;
  debit: number;
  credit: number;
  date: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  sku?: string;
  description?: string;
}
