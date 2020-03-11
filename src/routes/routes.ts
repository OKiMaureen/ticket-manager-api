import IndexController from "../controllers/index";
import express from 'express';

class Routes {
    public indexController: IndexController = new IndexController();
    public routes(app: express.Application = express()): void {
      app.get('/', this.indexController.index);
    }
  }
export default Routes