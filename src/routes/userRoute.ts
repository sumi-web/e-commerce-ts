import express from 'express';
import {
  createUser,
  forgotPassword,
  loginUser,
  logoutUser,
  resetPassword,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

export { router };
