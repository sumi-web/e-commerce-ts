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
  role: String;
  resetPassword: String;
  resetPasswordExpire: Date;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: [true, 'Name can not be empty'] },
  email: { type: String, unique: true, required: [true, 'email is required'] },
  password: { type: String, required: [true, 'password can not be empty'], select: false },
  avatar: { public_id: { type: String, required: true }, url: { type: String, required: true } },
  role: { type: String, required: true },
  resetPassword: String,
  resetPasswordExpire: Date,
});

export default model<User>('User', UserSchema);
