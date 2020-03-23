import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import User from '../entity/User';
import createToken from '../utils/createToken';
import {
  success,
  fail,
  userExists,
  userCreated,
  incorrectCredentials,
  userLoggedIn,
} from '../utils/messages';

export default class UserController {
  public createUser = async (req: Request, res: Response) => {
    // Get parameters from the body
    const userData = req.body;
    const user = new User();
    let newUser: User;
    const userRepository = getRepository(User);
    user.userName = userData.userName;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = userData.password;
    user.role = userData.role;

    // Validade the parameters
    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      res.status(400).json({
        status: fail,
        data: {
          error: errors[0].constraints,
        },
      });
      return;
    }

    // Hash the password, to securely on DB
    user.hashPassword();

    // Checks for unique username and email before saving
    try {
      newUser = await userRepository.save({
        ...user,
      });
    } catch (error) {
      res.status(409).json({
        message: userExists,
        status: fail,
      });
      return;
    }

    // Sends 201 status and created instance when saved
    const token = createToken(newUser.id, newUser.email, newUser.userName, newUser.role);
    res.status(201).json(
      {
        message: userCreated,
        status: success,
        data: {
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            userName: newUser.userName,
            email: newUser.email,
            role: newUser.role,
          },
          token,
        },
      },
    );
  }

  public loginUser = async (req: Request, res: Response) => {
    const { userNameOrEmail, password } = req.body;

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    if (userNameOrEmail.includes('@')) {
      try {
        user = await userRepository.findOneOrFail({ email: userNameOrEmail });
      } catch (error) {
        res.status(401).json(
          {
            message: incorrectCredentials,
            status: fail,
          },
        );
        return;
      }
    } else {
      try {
        user = await userRepository.findOneOrFail({ userName: userNameOrEmail });
      } catch (error) {
        res.status(401).json(
          {
            message: incorrectCredentials,
            status: fail,
          },
        );
        return;
      }
    }

    // Check encrypted password match
    if (!user.checkPassword(password)) {
      res.status(401).json(
        {
          message: incorrectCredentials,
          status: fail,
        },
      );
      return;
    }

    // Create Token
    const token = createToken(user.id, user.email, user.userName, user.role);
    res.status(200).json(
      {
        message: userLoggedIn,
        status: success,
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            role: user.role,
          },
          token,
        },
      },
    );
  };
}
