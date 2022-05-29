import { Request, Response, NextFunction } from 'express';
import { ProductModel } from '../models/productModel';
import { ErrorHandler } from '../utils/errorHandler';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';
import { ApiFeature, QueryStr } from '../utils/apiFeature';

// create product --admin access only
export const createProduct = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      req.body.user = req.user.id;
    }

    const product = await await ProductModel.create(req.body);
    res.status(201).json({ success: true, product });
  },
);

// get all product
export const getAllProducts = catchAsyncErrors(
  async (req: Request, res: Response): Promise<void> => {
    const resultPerPage: number = 5;
    const totalProductCount: number = await ProductModel.countDocuments();

    const apiFeature = new ApiFeature(ProductModel.find(), req.query as QueryStr)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeature.query;

    res.json({ success: true, product: products, totalProductCount });
  },
);

// update a product -- admin access only
export const updateProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId } = req.params;
    const data = req.body;

    let product = await ProductModel.findById(productId).exec();

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    product = await ProductModel.findByIdAndUpdate(productId, data, {
      runValidators: true,
      new: true,
    }).exec();

    res.json({ success: true, product });
  },
);

// delete a product
export const deleteProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId).exec();
    console.log('check product', product);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    await product.remove();

    res.json({ success: true, message: 'Product deleted successfully' });
  },
);

// get single product detail
export const getProductDetail = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId).exec();

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.json({ success: true, product });
  },
);
