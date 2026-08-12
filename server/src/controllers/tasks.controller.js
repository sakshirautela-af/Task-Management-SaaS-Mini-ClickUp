import * as taskService from "../service/tasks.service.js";

export const createTask = async (req, res, next) => {
  try {
    const { name, description, dueDate, priority, status, projectId } = req.body;
    if (!name || !projectId) {
      return res.status(400).json({
        message: "Missing required fields: name and projectId"
      });
    }

    const task = await taskService.createTask({
      name,
      description,
      dueDate,
      priority,
      status,
      projectId
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
    const tasks = await taskService.getAllTasks(projectId);
    res.status(200).json({
      message: "Tasks retrieved successfully",
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
    const task = await taskService.getTaskByUser(id);
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
    const task = await taskService.updateTask(id, req.body);
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



