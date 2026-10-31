import app from './app.js';
import prisma from './config/database.js';
import { cleanExpiredLocks } from './services/seatService.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log('[Database] Connected successfully to PostgreSQL database.');

    const server = app.listen(PORT, () => {
      console.log(`[CineVerse 3D Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[CineVerse 3D Server] API Base URL: http://localhost:${PORT}/api`);
    });

    // Periodic sweep for expired seat reservations every 60 seconds
    const cleanupInterval = setInterval(async () => {
      try {
        await cleanExpiredLocks();
      } catch (err) {
        console.error('[Cleanup Error] Failed to sweep expired locks:', err.message);
      }
    }, 60 * 1000);

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n[CineVerse 3D Server] Gracefully shutting down...');
      clearInterval(cleanupInterval);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[Database] Disconnected from PostgreSQL.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('[Server Error] Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();
