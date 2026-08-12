import express from 'express';
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser
  ,findUserByEmail
} from '../controllers/users.controller.js';

const router = express.Router();

router.get('/get', getUser);
router.post('/create', createUser);
router.get('/:id', getUserById);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/byEmail/:email',findUserByEmail)
export default router;