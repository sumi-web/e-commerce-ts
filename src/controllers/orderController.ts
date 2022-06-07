import { Request, Response } from 'express';
// import { catchAsyncErrors } from '../middlewares/catchAsyncErrors';
// import { OrderModel } from '../models/orderModel';

//create new order
export const createOrder =
  (param: string) =>
  async (_req: Request, res: Response): Promise<void> => {
    console.log('check the new order api', param);
    res.status(200).json({
      success: true,
    });
  };
