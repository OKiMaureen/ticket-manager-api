import express from 'express';
import IndexController from '../controllers/index';
import UserController from '../controllers/user';
import StoryController from '../controllers/story';
import { authenticate, authenticateAdmin } from '../middlewares/authenticate';
import findStoryById from '../middlewares/findById';

class Routes {
  public indexController: IndexController = new IndexController();

  public userController: UserController = new UserController();

  public storyController: StoryController = new StoryController();

  public routes(app: express.Application = express()): void {
    app.get('/', this.indexController.index);
    app.post('/api/v1/auth/signup', this.userController.createUser);
    app.post('/api/v1/auth/signin', this.userController.loginUser);
    app.post('/api/v1/stories/user', authenticate, this.storyController.createStory);
    app.get('/api/v1/stories/user', authenticate, this.storyController.userListAllStories);
    app.get('/api/v1/stories/admin', authenticate, authenticateAdmin, this.storyController.adminListAllStories);
    app.put('/api/v1/story/:id/assign', authenticate, this.storyController.assignStory);
    app.put('/api/v1/story/:id/approve', authenticate, authenticateAdmin, findStoryById, this.storyController.approve);
    app.put('/api/v1/story/:id/reject', authenticate, authenticateAdmin, findStoryById, this.storyController.reject);
  }
}
export default Routes;
