import express from 'express';

import {
  createProduct,
  createProductReview,
  deleteProduct,
  deleteReview,
  getAllProducts,
  getAllReviewsOfProduct,
  getProductDetails,
  updateProduct,
} from '../controllers/productController';
import { isAuthenticatedUser, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

// create a new product
router.post('/products/new', isAuthenticatedUser, authorizeRoles, createProduct);

// get all products
router.get('/products', getAllProducts);

// update a product and delete and get single product
router
  .route('admin/products/:productId')
  .put(isAuthenticatedUser, authorizeRoles, updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles, deleteProduct);

router.get('/product/:productId', getProductDetails);

router.put('/review', isAuthenticatedUser, createProductReview);

router.route('/reviews').get(getAllReviewsOfProduct).delete(isAuthenticatedUser, deleteReview);

export { router };
