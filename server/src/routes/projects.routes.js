import express from 'express';
import {
    findProjectByUser,
    createProject,
    getProject,
    getProjectById,
    updateProject,
    deleteProject
} from '../controllers/projects.controller.js';

const projectroutes = express.Router();

projectroutes.get('/get', getProject);

projectroutes.post('/create', createProject);

projectroutes.get('/role/:role', findProjectByUser);

projectroutes.get('/get/:id', getProjectById);

projectroutes.put('/update/:id', updateProject);

projectroutes.delete('/delete/:id', deleteProject);

export default projectroutes;