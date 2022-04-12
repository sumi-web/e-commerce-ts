import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';
// import { ErrorHandler } from '../utils/errorHandler';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';

//register a user
export const createUser = catchAsyncErrors(async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  const user = await UserModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is sample id',
      url: 'profile url',
    },
  });

  res.status(201).json({ success: true, user });
});
