import IndexController from '../controllers/index';
import { UserController} from '../controllers/user';
import express from 'express';

class Routes {
    public indexController: IndexController = new IndexController();
    public userController: UserController = new UserController();
    public routes(app: express.Application = express()): void {
      app.get('/', this.indexController.index);
      app.post('/api/v1/auth/signup', this.userController.createUser);
      app.post('/api/v1/auth/signin', this.userController.loginUser);
    }
  }
export default Routes