import { Request, Response } from 'express';

class IndexController {
  public index(req: Request, res: Response) {
    res.status(200).json({
      message: 'Welcome to ticket manager API',
    });
  }
}
export default IndexController;
