import { FastifyInstance } from 'fastify';
import { db, entities } from '@business-os/database';
import { eq, and, ne } from 'drizzle-orm';
import { z } from 'zod';

export async function contactRoutes(fastify: FastifyInstance) {
  // 1. Create Contact (Client or Supplier)
  fastify.post('/', async (request, reply) => {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      type: z.enum(['CLIENT', 'SUPPLIER']),
    });

    const { name, email, type } = schema.parse(request.body);
    
    // Check if email already used
    const existing = await db.select().from(entities).where(eq(entities.email, email)).get();
    if (existing) {
      return reply.status(400).send({ message: 'A contact or user with this email already exists' });
    }

    const [contact] = await db.insert(entities).values({
      name,
      email,
      type,
      password: 'external-contact', // Contacts don't log in
    }).returning();

    return { contact: { id: contact.id, name: contact.name, email: contact.email, type: contact.type } };
  });

  // 2. List Contacts (Filtering out internal users)
  fastify.get('/', async () => {
    return db.select({
      id: entities.id,
      name: entities.name,
      email: entities.email,
      type: entities.type,
      createdAt: entities.createdAt,
    })
    .from(entities)
    .where(ne(entities.type, 'INTERNAL'));
  });

  // 3. Get Single Contact
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const contact = await db.select().from(entities).where(and(eq(entities.id, id), ne(entities.type, 'INTERNAL'))).get();
    
    if (!contact) return reply.status(404).send({ message: 'Contact not found' });
    return { contact: { id: contact.id, name: contact.name, email: contact.email, type: contact.type } };
  });
}
