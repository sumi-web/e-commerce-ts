import { Schema, model, Model, Types } from 'mongoose';

interface Images {
  public_id: string;
  url: string;
}

interface Reviews {
  name: string;
  rating: number;
  comment: string;
}

export interface Product {
  name: string;
  description: string;
  price: string;
  rating: number;
  images: Types.DocumentArray<Images>;
  category: string;
  stock: number;
  numOfReviews: number;
  reviews: Types.DocumentArray<Reviews>;
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
  rating: { type: Number, default: 0 },
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
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
});

export const ProductModel = model<Product>('Product', ProductSchema);
