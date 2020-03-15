import express from 'express';
import Routes from '../routes/routes';
import bodyParser from 'body-parser';



export default class Server {
    private readonly _app: express.Application = express();
    private _allRoutes: Routes = new Routes();
    private config(): void{
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({extended:false}))
     }

	public constructor() {
        this.config();
		this._allRoutes.routes(this._app);
	}
	public get app(): express.Application {
		return this._app;
	}
}