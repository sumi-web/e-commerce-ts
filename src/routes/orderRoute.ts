import express from 'express';
import { createOrder } from '../controllers/orderController';
import { isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

// create a new order
router.post('/orders/new', isAuthenticatedUser, (req, res) => createOrder('new')(req, res));

export { router };
