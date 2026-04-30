/**
 * @business-os/shared
 * Core primitive types for the entire system.
 */

export enum EntityType {
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  INTERNAL = 'INTERNAL'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  entityId: string;
  description: string;
  status: TransactionStatus;
  createdAt: Date;
}

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  type: 'PRODUCT' | 'SERVICE';
  stockCount?: number;
}
