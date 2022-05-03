import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema, model } = mongoose;

interface Avatar {
  public_id: String;
  url: String;
}

export interface User extends mongoose.Document {
  name: String;
  email: String;
  password: String;
  avatar: Avatar;
  role?: String;
  resetPassword?: String;
  resetPasswordExpire?: Date;
  getJwtToken(): string;
  comparePassword(password: string): boolean;
}

const UserSchema = new Schema<User>({
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
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE as string,
  });
};

UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = model<User>('User', UserSchema);
