import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { ErrorHandler } from '../utils/errorHandler';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';
import { sendToken } from '../utils/sendJwtToken';

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

  sendToken(user, 201, res);
});

// login user
export const loginUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler('Please Enter email & password ', 400));
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    //compare password
    const isPassMatched = await user.comparePassword(password);

    console.log('password mathched', isPassMatched);

    if (!isPassMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
  },
);
