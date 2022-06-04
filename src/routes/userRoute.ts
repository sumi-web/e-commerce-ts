import express from 'express';
import {
  changePassword,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  getUserDetails,
  loginUser,
  logoutUser,
  resetPassword,
  updateProfile,
  updateUserRole,
} from '../controllers/userController';
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/auth';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/password/change', isAuthenticatedUser, changePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles, getAllUsers);
router
  .route('/admin/user/:userId')
  .get(isAuthenticatedUser, authorizeRoles, getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles, updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles, deleteUser);

export { router };
