import express from 'express';
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  findUserByEmail,
  sendSignupOtp
} from '../controllers/users.controller.js';

import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createUser);
router.post('/create', createUser);
router.post('/login', findUserByEmail);
router.get('/byEmail/:email', findUserByEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/signup-otp', sendSignupOtp);

// Protected routes
router.use(authMiddleware);

router.get('/', getUser);
router.get('/get', getUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;