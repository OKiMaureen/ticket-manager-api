import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret: string = (process.env.JWT_SECRET as string);
const oneDay: number = 60 * 60 * 24;

const createToken = (id: number, email: string, userName: string, role: string) => jwt.sign(
  {
    id, email, userName, role,
  },
  secret,
  { expiresIn: oneDay },
);

export default createToken;
