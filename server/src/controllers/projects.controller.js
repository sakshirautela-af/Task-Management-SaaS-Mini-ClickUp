import * as projectService from "../service/projects.service.js";
import * as userService from "../service/users.service.js";
import { roles } from "../enum/Roles.js";
export const findProjectByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }
    const user = await userService.getUserByID(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
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
    const body = req.body || {};
    const userId = body.userId || body.createdBy || req.user?.id;
    if (!userId) {
      return res.status(400).json({
        message: "Missing creator user ID",
      });
    }
    const user = await userService.getUserByID(userId);
    if (!user) {
      return res.status(404).json({
        message: "Creator user not found",
      });
    }
    const { name, description, startDate, endDate, status, assignId, updatedBy } = body;
    if (!name || !description) {
      return res.status(400).json({
        message: "Missing required field: name and description",
      });
    }
    if (assignId) {
      const assignUser = await userService.getUserByID(assignId);
      if (!assignUser) {
        return res.status(404).json({ message: "Assignee user not found" });
      }
    }
    if (updatedBy) {
      const updateUser = await userService.getUserByID(updatedBy);
      if (!updateUser) {
        return res.status(404).json({ message: "Updater user not found" });
      }
    }
    const project = await projectService.createProject({
      name,
      description,
      startDate,
      endDate,
      status,
      userId: Number(userId),
      assignId: assignId ? Number(assignId) : undefined,
      updatedBy: updatedBy ? Number(updatedBy) : Number(userId),
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
export const filterProjects = async (req, res, next) => {
  try {
    const { userId, tab, status, search, page, limit, sortBy, sortOrder, order } = req.query || {};
    const data = await projectService.filterProjects({
      userId,
      tab,
      status,
      search,
      page,
      limit,
      sortBy,
      sortOrder: sortOrder || order,
    });
    res.status(200).json({
      message: "Filtered projects retrieved successfully",
      data,
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
    const body = req.body || {};
    if (body.assignId) {
      const assignUser = await userService.getUserByID(body.assignId);
      if (!assignUser) {
        return res.status(404).json({ message: "Assignee user not found" });
      }
    }
    if (body.updatedBy) {
      const updateUser = await userService.getUserByID(body.updatedBy);
      if (!updateUser) {
        return res.status(404).json({ message: "Updater user not found" });
      }
    }
    const project = await projectService.updateProject(id, body);
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
    const deletedProject = await projectService.deleteProject(id);
    res.status(200).json({
      message: "Project deleted successfully",
      body: deletedProject,
    });
  } catch (error) {
    next(error);
  }
};
export const getDashboardStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const stats = await projectService.getDashboardStats(userId);
    res.status(200).json({
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
