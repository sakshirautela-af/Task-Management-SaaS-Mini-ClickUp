import * as projectService from "../service/projects.service.js";
import * as fileService from "../service/filles.service.js";
import path from "path";
import fs, { unlink } from "fs";
import { promisify } from "util";
const uploadLocation = path.resolve(import.meta.dirname, "../../uploads");

const addFileUrl = (req, file) => {
  if (!file) return file;
  return {
    ...file,
    downloadUrl: `${req.protocol}://${req.get("host")}/api/files/file-download/${file.id}`
  };
};
export const fileUpload = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!req.file) {
      return res.status(400).json({
        message: "file is required",
      });
    }
    if (!projectId) {
      return res.status(400).json({
        message: "projectId is required",
      });
    }
    const filename = req.file.filename;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "project is not found",
      });
    }
    const response = await fileService.uploadFile(projectId, filename);
    res.status(200).json({
      message: "file uploaded sucessfully",
      body: response,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllFiles = async (req, res, next) => {
  try {
    const response = await fileService.getAllFiles();
    const body = response.map(f => addFileUrl(req, f));
    res.status(200).json({
      message: "file retrived sucessfully",
      body: body,
    });
  } catch (error) {
    next(error);
  }
};
export const getFilesByProjectId = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res.status(404).json({
        message: "project id is required",
      });
    }
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "project is not found",
      });
    }
    const response = await fileService.getAllFileByProjectId(projectId);
    const body = response.map(f => addFileUrl(req, f));
    res.status(200).json({
      message: "file retrived sucessfully",
      body: body,
    });
  } catch (error) {
    next(error);
  }
};
export const getFileByFileID = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({
        message: "file Id is required",
      });
    }
    const response = await fileService.getFileByFileId(fileId);
    res.status(200).json({
      message: "file retrived sucessfully",
      body: addFileUrl(req, response),
    });
  } catch (error) {
    next(error);
  }
};
export const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    const unlink_file = promisify(fs.unlink);
    const response = await fileService.deletFile(fileId);
    await fs.unlink(uploadLocation + "/" + response.location);
    res.status(200).json({
      message: "file uploaded sucessfully",
      body: response,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({
        message: "file Id is required",
      });
    }
    const file = await fileService.getFileByFileId(fileId);
    if (!file) {
      return res.status(404).json({
        message: "file not found",
      });
    }
    const filePath = path.join(uploadLocation, file.location);
    res.download(filePath, file.location);
  } catch (error) {
    next(error);
  }
};
