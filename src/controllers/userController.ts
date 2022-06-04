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

// get user detail
export const getUserDetails = catchAsyncErrors(
  async (req: Request, res: Response): Promise<Response | void> => {
    if (!!req.user) {
      const user = await UserModel.findById(req.user.id);
      res.status(200).json({
        success: true,
        user,
      });
    }
  },
);

// change user password
export const changePassword = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!!req.user) {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      const user = await UserModel.findById(req.user.id).select('+password');

      if (!user) {
        return next(new ErrorHandler('User not found', 404));
      }

      //compare password
      const isPassMatched = await user.comparePassword(currentPassword);

      if (!isPassMatched) {
        return next(new ErrorHandler('Current password is incorrect', 400));
      }

      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
      }

      user.password = newPassword;
      user.save();
      sendToken(user, 200, res);
    }
  },
);

// update your user profile
export const updateProfile = catchAsyncErrors(async (req: Request, res: Response) => {
  if (!!req.user) {
    const newUserData = {
      ...req.body,
    };

    // we will add cloudinary later

    const user = await UserModel.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user,
    });
  }
});

//  get all users -- admin
export const getAllUsers = catchAsyncErrors(async (_req: Request, res: Response) => {
  const allUsers = await UserModel.find({});

  res.status(200).json({
    success: true,
    users: allUsers,
  });
});

//  get single user -- admin
export const getSingleUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new ErrorHandler(`User does not exist with Id ${userId}`, 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);

// update user profile -- Admin
export const updateUserRole = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!!req.user) {
      const { userId } = req.params;
      // we can change user role here too
      const newUserData = {
        ...req.body,
      };

      const user = await UserModel.findByIdAndUpdate(userId, newUserData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return next(new ErrorHandler(`User does not exist with Id ${userId}`, 404));
      }

      res.status(200).json({
        success: true,
      });
    }
  },
);

//  delete user -- Admin
export const deleteUser = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    // we will remove cloudinary later

    const user = await UserModel.findByIdAndDelete(userId);
    console.log('check the result here', user);

    if (!user) {
      return next(new ErrorHandler(`User does not exist with Id ${userId}`, 404));
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  },
);
