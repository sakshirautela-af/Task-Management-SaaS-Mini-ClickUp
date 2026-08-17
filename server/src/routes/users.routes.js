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
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router();
router.get('/auth',authMiddleware)
router.post('/create', createUser);
router.post('/login', findUserByEmail);
router.post('/reset-password', resetPassword);

//router.use(authMiddleware);

router.get('/byEmail/:email', findUserByEmail);
router.get('/get', getUser);
router.get('/:id', getUserById);
router.patch('/update/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;