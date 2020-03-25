import 'reflect-metadata';
import { config } from 'dotenv';
import express from 'express';
import { Connection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import { typeormConnection } from './config/connection';
import Server from '../src/config/server';
import { logger } from '../src/config/logger';

// initialize configuration
config();
(async function main() {
  try {
    const connection: Connection = await typeormConnection();

    // Init express server
    const { app } = new Server();
    const server: HttpServer = createServer(app);

    // Start express server
    server.listen(process.env.PORT);

    server.on('listening', () => {
      logger.info(`listening on port ${process.env.PORT} in ${process.env.NODE_ENV} env`);
    });

    server.on('close', () => {
      connection.close();
      logger.info('Server closed');
    });
  } catch (err) {
    logger.error(err.stack);
  }
}());
