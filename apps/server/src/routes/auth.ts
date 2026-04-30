import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { db, entities } from '@business-os/database';
import { eq } from 'drizzle-orm';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Signup
  fastify.post('/signup', async (request, reply) => {
    const { name, email, password } = signupSchema.parse(request.body);
    
    // Check if user exists
    const existingUser = await db.select().from(entities).where(eq(entities.email, email)).get();
    if (existingUser) {
      return reply.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await db.insert(entities).values({
      name,
      email,
      password: hashedPassword,
      type: 'INTERNAL',
      role: 'OWNER',
    }).returning().get();
    
    return { 
      message: 'User created successfully', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email } 
    };
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    
    const user = await db.select().from(entities).where(eq(entities.email, email)).get();
    if (!user || !user.password) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
    
    const token = fastify.jwt.sign({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  });
}
