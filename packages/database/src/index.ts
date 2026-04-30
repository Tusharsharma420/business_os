import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';
import path from 'path';

// Locate the database at the root of the monorepo
const dbPath = `file:${path.resolve(process.cwd(), process.cwd().includes('apps') || process.cwd().includes('packages') ? '../../business_os.db' : './business_os.db')}`;

const client = createClient({ 
  url: process.env.DATABASE_URL || dbPath 
});

export const db = drizzle(client, { schema });

export * from './schema.js';
