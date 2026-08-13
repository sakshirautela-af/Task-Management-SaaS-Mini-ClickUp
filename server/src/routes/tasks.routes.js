import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  filterTasks
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/get', getTasks);

router.get('/filter', filterTasks);

router.post('/create', createTask);

router.get('/get/:id', getTaskById);

router.patch('/update/:id', updateTask);

router.delete('/delete/:id', deleteTask);

export default router;