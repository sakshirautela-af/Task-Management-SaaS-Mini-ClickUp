import * as projectService from "../service/projects.service.js";
import * as userService from "../service/users.service.js";
import { roles } from "../enum/Roles.js";
import { use } from "react";
export const findProjectByUser = async (req, res, next) => {
  try {
    const id = req.userId;
    const user = await userService.getUserByID(id);
    const projects = await projectService.getProjectByUser(id);
    res.status(200).json({
      message: "project data retrieved successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await userService.getUserByID(userId);
    // if(user.role !==roles.ADMIN || user.role!==roles.SUPERADMIN){
    //   return res.status(403).json({
    //     message: "Access Denied to create project"
    //   })
    // }
    const { name, description, startDate } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        message: "Missing required field: name",
      });
    }

    const project = await projectService.createProject({
      name,
      description,
      startDate,
      userId,
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.body);
    res.status(200).json({
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const res = await projectService.deleteProject(id);
    res.status(200).json({
      message: "Project deleted successfully",
      body: res,
    });
  } catch (error) {
    next(error);
  }
};
