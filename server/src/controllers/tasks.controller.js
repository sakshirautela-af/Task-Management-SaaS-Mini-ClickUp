import * as taskService from "../service/tasks.service.js";
import * as userService from "../service/users.service.js";

export const createTask = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, priority, status, projectId, assignedBy, assignedTo } = req.body || {};
    if (!name || !projectId) {
      return res.status(400).json({
        message: "Missing required fields: name and projectId"
      });
    }

    if (assignedBy) {
      const assignerUser = await userService.getUserByID(assignedBy);
      if (!assignerUser) {
        return res.status(404).json({ message: "Assigner user not found" });
      }
    }

    if (assignedTo) {
      const assigneeUser = await userService.getUserByID(assignedTo);
      if (!assigneeUser) {
        return res.status(404).json({ message: "Assignee user not found" });
      }
    }

    const task = await taskService.createTask({
      name,
      description,
      startDate,
      endDate,
      priority,
      status,
      projectId,
      assignedBy,
      assignedTo
    });

    res.status(201).json({
      message: "Task created successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const tasks = await taskService.getAllTasks({ projectId });
    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const filterTasks = async (req, res, next) => {
  try {
    const { projectId, search, priority, status } = req.query;
    const tasks = await taskService.filterTasks(projectId, search, priority, status);
    res.status(200).json({
      message: "Filtered tasks retrieved successfully",
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task retrieved successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};


export const getTaskByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, priority, status } = req.query;
    const task = await taskService.getTaskByUser(id, { search, priority, status });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task retrieved successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (body.assignedBy) {
      const assignerUser = await userService.getUserByID(body.assignedBy);
      if (!assignerUser) {
        return res.status(404).json({ message: "Assigner user not found" });
      }
    }

    if (body.assignedTo) {
      const assigneeUser = await userService.getUserByID(body.assignedTo);
      if (!assigneeUser) {
        return res.status(404).json({ message: "Assignee user not found" });
      }
    }

    const task = await taskService.updateTask(id, body);
    res.status(200).json({
      message: "Task updated successfully",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};



