import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/tasks.controller.js';

const router = express.Router();

router.get('/get', getTasks);

router.post('/create', createTask);

router.get('/get/:id', getTaskById);

router.put('/update/:id', updateTask);

router.delete('/delete/:id', deleteTask);

export default router;