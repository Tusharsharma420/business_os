import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.js';
import { ledgerRoutes } from './routes/ledger.js';
import { catalogRoutes } from './routes/catalog.js';
import { contactRoutes } from './routes/contacts.js';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Middleware
fastify.register(cors, {
  origin: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret_change_me',
});

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(ledgerRoutes, { prefix: '/api/ledger' });
fastify.register(catalogRoutes, { prefix: '/api/catalog' });
fastify.register(contactRoutes, { prefix: '/api/contacts' });

// Health Check
fastify.get('/health', async () => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '5.0.0-first-principles' 
  };
});

// Start Server
// Root Route for Discovery
fastify.get('/', async () => {
  return {
    name: 'Business OS API',
    version: '5.0.0-first-principles',
    status: 'operational',
    documentation: '/health',
    timestamp: new Date().toISOString(),
  };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Business OS Server ready at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
