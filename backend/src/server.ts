import app from './app.js';
import {prisma} from './lib/prisma.js';

const port = process.env.PORT ?? 4000;

const server = app.listen(port, () => {
  // Log minimal startup message to aid debugging without cluttering
  console.log(`Backend listening on port ${port}`);
});

const shutdown = async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
