import 'reflect-metadata';
import {config}from 'dotenv';
import express from 'express';
import {  createConnection, Connection } from 'typeorm'
import { createServer, Server as HttpServer } from 'http';
import Server from  '../src/config/server'
import { logger } from '../src/config/logger';


// initialize configuration
config();
(async function main() {
	try {
		const connection: Connection = await createConnection();

		// Init express server
		const app: express.Application = new Server().app;
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
})();
