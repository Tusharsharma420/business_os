import { FastifyInstance } from 'fastify';
import { db, accounts, transactions, ledgerEntries } from '@business-os/database';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export async function ledgerRoutes(fastify: FastifyInstance) {
  // 1. Create a new Account (Asset, Liability, etc.)
  fastify.post('/accounts', async (request, reply) => {
    const schema = z.object({
      name: z.string(),
      type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']),
      description: z.string().optional(),
    });

    const { name, type, description } = schema.parse(request.body);
    
    const [account] = await db.insert(accounts).values({
      name,
      type,
      description,
    }).returning();

    return { account };
  });

  // 2. Log a Double-Entry Transaction
  fastify.post('/transaction', async (request, reply) => {
    const schema = z.object({
      description: z.string(),
      amount: z.number().positive(),
      debitAccountId: z.string(), // e.g. Cash
      creditAccountId: z.string(), // e.g. Revenue
      metadata: z.record(z.any()).optional(),
    });

    const { description, amount, debitAccountId, creditAccountId, metadata } = schema.parse(request.body);

    // Atomic Transaction using Drizzle's transaction API
    const result = await db.transaction(async (tx) => {
      // Create the Master Transaction Record
      const [txRecord] = await tx.insert(transactions).values({
        description,
        amount,
        metadata: JSON.stringify(metadata),
      }).returning();

      // Create the Debit Entry
      await tx.insert(ledgerEntries).values({
        transactionId: txRecord.id,
        accountId: debitAccountId,
        debit: amount,
        credit: 0,
      });

      // Create the Credit Entry
      await tx.insert(ledgerEntries).values({
        transactionId: txRecord.id,
        accountId: creditAccountId,
        debit: 0,
        credit: amount,
      });

      return txRecord;
    });

    return { transaction: result };
  });

  // 3. Get Account Balance (Aggregated)
  fastify.get('/accounts/:id/balance', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select({
      balance: sql<number>`SUM(debit) - SUM(credit)`
    })
    .from(ledgerEntries)
    .where(eq(ledgerEntries.accountId, id));

    return { accountId: id, balance: result[0]?.balance || 0 };
  });

  // 4. List all Accounts
  fastify.get('/accounts', async () => {
    return db.select().from(accounts);
  });
}
