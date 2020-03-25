import express from 'express';
import bodyParser from 'body-parser';
import Routes from '../routes/routes';

export default class Server {
    private readonly _app: express.Application = express();

    private _allRoutes: Routes = new Routes();

    private _config(): void {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    public constructor() {
      this._config();
      this._allRoutes.routes(this._app);
    }

    public get app(): express.Application {
      return this._app;
    }
}
