import { ErrorRequestHandler } from 'express';
import { ErrorHandler } from '../utils/errorHandler';

export const errorMiddleWare: ErrorRequestHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // handle wrong mongodb id
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === 'jsonWebTokenError') {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  //  JWT expire error
  if (err.name === 'TokenExpiredError') {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
      ...err,
    },
  });
};
