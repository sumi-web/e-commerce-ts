import { Request, Response, NextFunction } from "express";

import { productModel } from "../models/productModel";

import { ErrorHandler } from "../utils/errorHandler";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import { ApiFeature } from "../utils/apiFeature";

// create product --admin route sonly admin can access this
export const createProduct = catchAsyncErrors(
	async (req: Request, res: Response): Promise<void> => {
		const product = await productModel.create(req.body);
		res.status(201).json({ success: true, product });
	}
);

// get all product
export const getAllProducts = catchAsyncErrors(
	async (req: Request, res: Response): Promise<void> => {
		const apiFeature = new ApiFeature(productModel.find(), req.query as any).search().filter();

		const products = await apiFeature.query;

		res.json({ success: true, product: products });
	}
);

// update a product -- admin access only
export const updateProduct = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		const { productId } = req.params;
		const data = req.body;

		let product = await productModel.findById(productId).exec();

		if (!product) {
			return next(new ErrorHandler("Product not found", 404));
		}

		product = await productModel
			.findByIdAndUpdate(productId, data, {
				runValidators: true,
				new: true,
			})
			.exec();

		res.json({ success: true, product });
	}
);

// delete a product
export const deleteProduct = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		const { productId } = req.params;

		const product = await productModel.findById(productId).exec();
		console.log("check product", product);

		if (!product) {
			return next(new ErrorHandler("Product not found", 404));
		}

		await product.remove();

		res.json({ success: true, message: "Product deleted successfully" });
	}
);

// get single product detail --admin
export const getProductDetail = catchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		const { productId } = req.params;

		const product = await productModel.findById(productId).exec();

		if (!product) {
			return next(new ErrorHandler("Product not found", 404));
		}

		res.json({ success: true, product });
	}
);
