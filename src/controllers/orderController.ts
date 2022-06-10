import { NextFunction, Request, Response } from 'express';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';
import { OrderModel } from '../models/orderModel';
import { ProductModel } from '../models/productModel';
import { ErrorHandler } from '../utils/errorHandler';
import { Types } from 'mongoose';

// create new order
export const createOrder = catchAsyncErrors(async (req: Request, res: Response): Promise<void> => {
  if (!!req.user) {
    req.body.user = req.user.id;
  }

  const {
    shippingInfo,
    orderItems,
    user,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await OrderModel.create({
    shippingInfo,
    orderItems,
    user,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get a single order details -- Admin
export const getSingleOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId).populate('user', 'name email');

    if (!order) {
      return next(new ErrorHandler(`Order not found with id ${orderId}`, 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  },
);

// get all orders by user when logged in
export const myOrders = catchAsyncErrors(
  async (req: Request, res: Response): Promise<Response | void> => {
    const orders = await OrderModel.find({ user: req.user?._id });

    res.status(200).json({
      success: true,
      orders,
    });
  },
);

// get all orders --Admin
export const allOrders = catchAsyncErrors(
  async (_req: Request, res: Response): Promise<Response | void> => {
    const orders = await OrderModel.find({});

    const totalPrice = orders.reduce((prev, curr) => curr.totalPrice + prev, 0);

    res.status(200).json({
      success: true,
      orders,
      totalPrice,
    });
  },
);

// update order status --admin
export const updateOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return next(new ErrorHandler(`Order not found with id ${orderId}`, 404));
    }

    if (order.orderStatus === 'Delivered') {
      return next(new ErrorHandler('You have already delivered this order', 400));
    }

    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  },
);

// delete order
export const deleteOrder = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return next(new ErrorHandler(`Order not found with id ${orderId}`, 404));
    }

    await order.remove();

    res.status(200).json({
      success: true,
    });
  },
);

const updateStock = async (id: Types.ObjectId, quantity: number) => {
  const product = await ProductModel.findById(id);

  if (product) {
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }
};
