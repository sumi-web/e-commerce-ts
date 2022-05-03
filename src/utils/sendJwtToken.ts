import { Response } from 'express';
import { User } from '../models/userModel';

export const sendToken = (user: User, statusCode: number, res: Response) => {
  const token = user.getJwtToken();

  // options for cookies
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
  };

  res.status(statusCode).cookie('token', token, options).json({ success: true, user, token });
};
