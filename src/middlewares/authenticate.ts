import { config } from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail, invalidToken, notAuthenticated } from '../utils/messages';

config();
const secretKey = process.env.JWT_SECRET as string;
let jwtPayload;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the header
  const token = (req.headers.auth as string) || req.headers.token || req.query.token;

  // Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, secretKey);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).json({
      message: invalidToken,
      status: fail,
    });
    return;
  }
  next();
};
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the header
  const token = (req.headers.auth as string) || req.headers.token || req.query.token;

  // Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, secretKey);
    res.locals.jwtPayload = jwtPayload;
    if (res.locals.jwtPayload.role !== 'admin') {
      return res.status(403).json({
        message: notAuthenticated,
        status: fail,
      });
    } return next();
  } catch (error) {
    res.status(401).json({
      message: invalidToken,
      status: fail,
    });
  }
};
