import { FastifyInstance } from 'fastify';
import { db, catalog } from '@business-os/database';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export async function catalogRoutes(fastify: FastifyInstance) {
  // 1. Create Catalog Item
  fastify.post('/', async (request, reply) => {
    const schema = z.object({
      name: z.string(),
      price: z.number().positive(),
      sku: z.string().optional(),
      description: z.string().optional(),
    });

    const data = schema.parse(request.body);
    
    const [item] = await db.insert(catalog).values(data).returning();
    return { item };
  });

  // 2. List Catalog
  fastify.get('/', async () => {
    return db.select().from(catalog);
  });

  // 3. Get Single Item
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await db.select().from(catalog).where(eq(catalog.id, id)).get();
    
    if (!item) return reply.status(404).send({ message: 'Item not found' });
    return { item };
  });

  // 4. Update Item
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const schema = z.object({
      name: z.string().optional(),
      price: z.number().positive().optional(),
      sku: z.string().optional(),
      description: z.string().optional(),
    });

    const data = schema.parse(request.body);
    const [item] = await db.update(catalog).set(data).where(eq(catalog.id, id)).returning();
    
    return { item };
  });

  // 5. Delete Item
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await db.delete(catalog).where(eq(catalog.id, id));
    return { message: 'Item deleted successfully' };
  });
}
