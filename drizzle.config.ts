import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/server/schema/',
    out: './drizzle',
    dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
});