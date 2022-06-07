import { Schema, model, Model, Types, Document } from 'mongoose';

interface Images extends Document {
  public_id: string;
  url: string;
}

export interface Reviews extends Document {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface Product extends Document {
  name: string;
  description: string;
  price: string;
  ratings: number;
  images: Types.DocumentArray<Images>;
  category: string;
  stock: number;
  numOfReviews: number;
  reviews: Types.DocumentArray<Reviews>;
  user: Types.ObjectId;
}

const ProductSchema: Schema = new Schema<Product, Model<Product>>({
  name: {
    type: String,
    required: [true, 'Please Enter product Name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please Enter product Description'],
  },
  price: {
    type: String,
    required: [true, 'Please Enter product Price'],
    maxLength: [8, 'Price can not be exceed 8 characters'],
  },
  ratings: { type: Number, default: 0 },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  category: { type: String, required: [true, 'PLease Enter product Category'] },
  stock: {
    type: Number,
    required: [true, 'Please Enter product Stock'],
    maxLength: [4, 'Stock cannot exceed 4 characters'],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const ProductModel = model<Product>('Product', ProductSchema);
