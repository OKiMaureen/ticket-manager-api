import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import { validate, IsEmail, Validator } from "class-validator";


export class UserController {
  public createUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { userName, password,email, role } = req.body;
    let user = new User();
    user.userName = userName;
    user.email = email;
    user.password = password;
    user.role = role;
  
    //Validade if the parameters are ok
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      res.status(400).json({
        status: 'Fail',
        data:{error: errors[0].constraints
}
       });
      return;
    }
  
    //Hash the password, to securely store on DB
    user.hashPassword();
  
    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User);
    try {
      await userRepository.save(user);
    } catch (error) {
      res.status(409).json({
       message: "username or email already exists.",
       status: 'Fail',
      });
      return;
    }
  
    //If all ok, send 201 response
    res.status(201).json(
      {message: "User Created Succesfully.",
       status: 'success',
       data: {
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          role: user.role
        }
      },
      }
    )
  };
}