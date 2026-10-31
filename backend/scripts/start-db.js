import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../data/pgdata');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`[Database] Initializing persistent PostgreSQL engine at: ${dataDir}`);
const db = new PGlite(dataDir);
await db.waitReady;

const server = new PGLiteSocketServer({
  db,
  host: '127.0.0.1',
  port: 5432,
  maxConnections: 10,
});

await server.start();
console.log(`[Database] PostgreSQL wire protocol server listening on postgresql://postgres:postgres@127.0.0.1:5432/cineverse_db`);

// Keep process running
process.on('SIGINT', async () => {
  console.log('[Database] Shutting down database server...');
  await server.stop();
  process.exit(0);
});
