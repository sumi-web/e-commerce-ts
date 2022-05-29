import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import { ErrorHandler } from '../utils/errorHandler';
import { catchAsyncErrors } from './catchAsyncErrors';

interface JwtPayLoad {
  id: string;
}

export const isAuthenticatedUser = catchAsyncErrors(
  async (req: Request, _res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler('Please login to access this resource', 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayLoad;
    req.user = await UserModel.findById(decodedData.id);
    next();
  },
);

export const authorizeRoles = catchAsyncErrors(
  (req: Request, _res: Response, next: NextFunction) => {
    if (!!req?.user && req.user.role !== 'admin') {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403),
      );
    }

    next();
  },
);
