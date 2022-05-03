import { NextFunction } from 'express';
import { catchAsyncErrors } from './catchAsyncErrors';

export const isAuthenticatedUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies;
  },
);
