import { Response } from 'express';
import { IUser } from '../models/userModel';

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJwtToken();

  // options for cookies
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
  };

  res.status(statusCode).cookie('token', token, options).json({ success: true, user, token });
};
