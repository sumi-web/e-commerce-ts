import express from 'express';
import {
  allOrders,
  createOrder,
  deleteOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
} from '../controllers/orderController';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

// create a new order
router.post('/orders/new', isAuthenticatedUser, createOrder);

router.route('/order/:orderId').get(isAuthenticatedUser, getSingleOrder);

router.get('/orders/me', isAuthenticatedUser, myOrders);

router.get('/admin/orders', isAuthenticatedUser, authorizeRoles, allOrders);

router
  .route('/admin/order/:orderId')
  .put(isAuthenticatedUser, authorizeRoles, updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles, deleteOrder);

export { router };
