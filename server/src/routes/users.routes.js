import express from 'express';
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
  findUserByEmail,
} from '../controllers/users.controller.js';

import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', createUser);
router.post('/login', findUserByEmail);
router.get('/byEmail/:email', findUserByEmail);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(authMiddleware);

router.get('/', getUser);
router.get('/get', getUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;