import 'reflect-metadata';
import 'source-map-support/register';
import 'module-alias/register';

import { Connection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import express from 'express';
import supertest from 'supertest';
import { typeormConnection } from './src/config/connection';
import Server from './src/config/server';

export default class TestFactory {
    private _app!: express.Application;

    private _connection!: Connection

    private _server!: HttpServer

    public get app(): supertest.SuperTest<supertest.Test> {
      return supertest(this._app);
    }

    public get server(): HttpServer {
      return this._server;
    }

    public async init(): Promise<void> {
      this._connection = await typeormConnection();
      this._app = new Server().app;
      this._server = createServer(this._app).listen(process.env.PORT);
    }

    public async close(): Promise<void> {
      this._server.close();
      this._connection.close();
    }
}
