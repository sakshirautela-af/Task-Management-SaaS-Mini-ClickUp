import "dotenv/config";
import express from "express";
import corsMiddleware from "./config/cors.js";
import userRoutes from "./routes/users.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import otherRoutes from "./routes/others.routes.js";
import fileRoutes from "./routes/files.routes.js";
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/util", otherRoutes);
app.use("/api/files", fileRoutes);

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
