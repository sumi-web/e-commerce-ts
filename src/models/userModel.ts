import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Schema, model, Document } from 'mongoose';

interface Avatar {
  public_id: string;
  url: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: Avatar;
  role?: string;
  resetPassword?: string;
  resetPasswordExpire?: Date;
  getJwtToken(): string;
  comparePassword(password: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name can not be empty'],
    maxLength: [30, 'Name cannot exceed 30 characters'],
    minLength: [4, 'Name should have more than 4 characters'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'email is required'],
    validate: {
      validator: (v: unknown) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: [true, 'password can not be empty'],
    minLength: [6, 'Name should have more than 6 characters'],
    select: false,
  },
  avatar: { public_id: { type: String, required: true }, url: { type: String, required: true } },
  role: { type: String, required: true, default: 'user' },
  resetPassword: String,
  resetPasswordExpire: Date,
});

UserSchema.pre('save', async function (next) {
  // if pass gets modified then hash it otherwise keep it as it is
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password as string, 12);
});

// JWt Token
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare password
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// generating reset password token
UserSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hashing and adding resetPasswordToken to userSchema
  this.resetPassword = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const UserModel = model<IUser>('User', UserSchema);
