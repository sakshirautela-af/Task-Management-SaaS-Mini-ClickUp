import express from 'express';
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  findUserByEmail
} from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', getUser);
router.get('/get', getUser);
router.post('/', createUser);
router.post('/create', createUser);
router.post('/login', findUserByEmail);
router.get('/byEmail/:email', findUserByEmail);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/update/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;