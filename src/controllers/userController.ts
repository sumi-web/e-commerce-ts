import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { ErrorHandler } from '../utils/errorHandler';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';
import { sendToken } from '../utils/sendJwtToken';
import { sendEmail } from '../utils/sendEmail';
import crypto from 'crypto';

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

    if (!isPassMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
  },
);

export const logoutUser = catchAsyncErrors(
  async (_: Request, res: Response): Promise<Response | void> => {
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Logged Out',
    });
  },
);

// forgot password
export const forgotPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // get resetPassword token
    const resetToken = user.getResetPasswordToken();

    // save the user where resetPassword and resetPasswordExpire filed added
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {
      await sendEmail({
        email: user.email,
        subject: `E-commerce Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (err) {
      user.resetPassword = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(err.message, 500));
    }
  },
);

// reset password
export const resetPassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      resetPassword: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler('Reset password token is invalid or has been expired', 404));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler('Password does not match', 400));
    }

    user.password = req.body.newPassword;

    user.resetPassword = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  },
);
