import mongoose from 'mongoose';

const { Schema, model } = mongoose;

interface Avatar {
  public_id: String;
  url: String;
}

interface User {
  name: String;
  email: String;
  password: String;
  avatar: Avatar;
  role?: String;
  resetPassword?: String;
  resetPasswordExpire?: Date;
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
      validator: function (v: any) {
        console.log('check the email section');
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
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

export const UserModel = model<User>('User', UserSchema);
