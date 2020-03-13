import { Request, Response } from "express";
import {connection} from "../config/Connection";
import User from "../entity/User";


export class UserController {
  public create(req: Request, res: Response) {
    connection.then(
      async connection => {
        let request = req.body;
        let user = new User();
        user.firstName = request.firstName;
        user.lastName = request.lastName;
        user.email = request.email;
        user.password = request.password;
        await connection.manager.save(user);
                res.json(
                  {message: "Successfully Saved.",
                   data: user
                  }
                )
            })
            .catch((error: Error) => {
                res.status(500).
                json(error);
            });
  }
}