import 'reflect-metadata' ; 
import 'source-map-support/register'; 
import 'module-alias/register'; 
// Set env to test 
process.env.NODE_ENV = 'test'; 
// Set env variables from . env file 
import { config } from 'dotenv' ; 
config() ; 
import { createConnection, ConnectionOptions, Connection } from 'typeorm'
import { createServer, Server as HttpServer} from 'http'
import express from 'express';
import supertest from 'supertest' ;
import Server from './src/config/server'

export default class TestFactory {
    private _app!: express.Application;
    private _connection!: Connection 
    private _server!: HttpServer
    
    // DB connection options 
    private options: ConnectionOptions ={
        type: 'postgres',
        database: 'ticketmanagerTest',
        logging: false, 
        synchronize: true,
        dropSchema: true,
        entities: ['src/entity/**/*.ts'],

    }
    public get app(): supertest.SuperTest<supertest.Test>{
        return supertest(this._app)
    }
   
    public get connection(): Connection{
        return this._connection
    }
    public get server(): HttpServer{
        return this._server
    }
 
    public async init() : Promise<void> {
        this._connection = await createConnection(this.options);
        this._app = new Server().app;
		this._server = createServer(this._app).listen(process.env.PORT);

    } 
    
    public async close() : Promise<void> {
        this._server.close();
		this._connection.close();
    }
    
}