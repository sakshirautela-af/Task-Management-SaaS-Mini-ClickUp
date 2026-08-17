import express from 'express';
import {
    findProjectByUser,
    createProject,
    getProject,
    getProjectById,
    updateProject,
    deleteProject,
    getDashboardStats,
    
} from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const projectroutes = express.Router();

// projectroutes.use(authMiddleware);

projectroutes.get('/stats/:userId', getDashboardStats);

projectroutes.get('/get', getProject);

projectroutes.post('/create', createProject);

projectroutes.get('/user/:id', findProjectByUser);

projectroutes.get('/get/:id', getProjectById);

projectroutes.patch('/update/:id', updateProject);

projectroutes.delete('/delete/:id', deleteProject);

export default projectroutes;