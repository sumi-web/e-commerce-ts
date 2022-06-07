import { Request, Response, NextFunction } from 'express';
import { ProductModel, Reviews } from '../models/productModel';
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
export const getProductDetails = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId).exec();

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.json({ success: true, product });
  },
);

// create new review or update the review
export const createProductReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { rating, comment, productId } = req.body;

    if (!!req.user) {
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };

      const product = await ProductModel.findById(productId);

      if (!product) {
        return next(new ErrorHandler('Product not found', 404));
      }

      // checking if same user has already reviewed this product
      const isReviewed = product.reviews.find(
        (rev: Reviews) => rev.user.toString() === req.user?._id.toString(),
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user?._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
          }
        });
      } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }

      let avgRating = 0;
      product.reviews.forEach((rev) => (avgRating += rev.rating));

      product.ratings = avgRating / product.reviews.length;

      product.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
      });
    }
  },
);

// get all reviews of a single product
export const getAllReviewsOfProduct = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId } = req.query;

    const product = await ProductModel.findById(productId).exec();

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  },
);

// delete a review
export const deleteReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { productId, reviewId } = req.query;

    const product = await ProductModel.findById(productId).exec();

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    const isReviewExist = product.reviews.findIndex(
      (rev) => rev._id.toString() === reviewId?.toString(),
    );

    if (isReviewExist < 0) {
      return next(new ErrorHandler('Review not found', 404));
    }

    const newReviews = product.reviews.filter((rev) => rev._id.toString() !== reviewId?.toString());

    let avgRating = 0;
    newReviews.forEach((rev) => (avgRating += rev.rating));

    const ratings = avgRating / newReviews.length;

    const numOfReviews = newReviews.length;

    const newProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { reviews: newReviews, ratings, numOfReviews },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      product: newProduct,
    });
  },
);
