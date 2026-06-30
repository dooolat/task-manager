import connectDB, { disconnectDB } from './config/db.js';
import { createApp } from './app.js';
import { loadEnvironment } from './config/env.js';

let server;

const shutdown = async (signal) => {
  try {
    console.log(`${signal} received. Shutting down gracefully...`);

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Graceful shutdown failed:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  const env = loadEnvironment();

  await connectDB(env.MONGODB_URI);

  const app = createApp({
    corsOrigins: env.CLIENT_ORIGINS,
    nodeEnv: env.NODE_ENV,
    authRateLimit: {
      rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
      rateLimitMax: env.RATE_LIMIT_MAX
    }
  });

  server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
});
