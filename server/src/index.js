import "dotenv/config";
import express from "express";
import corsMiddleware from "./config/cors.js";
import userRoutes from "./routes/users.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import otherRoutes from "./routes/others.routes.js";
import fileRoutes from "./routes/files.routes.js";
import notificationRoutes from "./routes/notifications.routes.js";
import { io } from "./server..js";
const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("io", io);
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("users", userRoutes);
app.use("projects", projectRoutes);
app.use("tasks", taskRoutes);
app.use("util", otherRoutes);
app.use("files", fileRoutes);
app.use("notifications", notificationRoutes);
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
