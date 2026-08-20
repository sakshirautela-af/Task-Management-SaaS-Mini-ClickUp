import express from "express";
import {
  fileUpload,
  getFileByFileID,
  getAllFiles,
  getFilesByProjectId,
  deleteFile,
  downloadFile,
} from "../controllers/filles.controller.js";
import upload from "../middleware/Fileupload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();
routes.use(authMiddleware);
routes.post("/file-upload/:id", upload.single("file"), fileUpload);
routes.get("/file-get", getAllFiles);
routes.delete("/file-delete/:id", deleteFile);
routes.get("/file-getById/:id", getFileByFileID);
routes.get("/file-getByProject/:id", getFilesByProjectId);
routes.get("/file-download/:id", downloadFile);
export default routes;
