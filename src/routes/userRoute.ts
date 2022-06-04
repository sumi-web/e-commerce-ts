import express from 'express';
import {
  changePassword,
  createUser,
  forgotPassword,
  getUserDetails,
  loginUser,
  logoutUser,
  resetPassword,
  updateProfile,
} from '../controllers/userController';
import { isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/password/change', isAuthenticatedUser, changePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);

export { router };
