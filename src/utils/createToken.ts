import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret: string = (<string>process.env.JWT_SECRET)
const oneDay: number = 60 * 60 * 24;

const createToken = (id: number, email: string, userName:string) => jwt.sign(
  { id, email, userName },
  secret,
  { expiresIn: oneDay },
);

export default createToken;