import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${path.resolve(process.cwd(), '../../business_os.db')}`,
  },
});
