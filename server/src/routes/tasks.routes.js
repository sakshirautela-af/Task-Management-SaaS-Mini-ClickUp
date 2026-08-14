import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  filterTasks,
  getPaginationData
  ,getTasksByProject
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/get', getTasks);
router.get('/byproject/:id', getTasksByProject);

router.get('/filter', filterTasks);

router.post('/create', createTask);

router.get('/get/:id', getTaskById);

router.patch('/update/:id', updateTask);

router.delete('/delete/:id', deleteTask);
router.get('/page/:page/:limit', getPaginationData);

export default router;