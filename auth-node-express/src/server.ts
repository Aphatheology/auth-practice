import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';

const migrateMongo = require('migrate-mongo');

const runMigrations = async () => {
  try {
    const { db, client } = await migrateMongo.database.connect();
    const migrated = await migrateMongo.up(db, client);
    migrated.forEach((file: any) => logger.info(`Migration applied: ${file}`));
    await client.close();
  } catch (err) {
    logger.error('Migration failed:', err);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await runMigrations();
    await mongoose.connect(config.mongoose.url);
    const server = app.listen(config.port, () => {
      logger.info(`Db connected and app listening on port ${config.port}`);
    });

    const shutdown = async () => {
      logger.info('Shutting down...');
      await mongoose.disconnect();
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
