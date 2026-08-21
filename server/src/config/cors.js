import cors from "cors";
export const corsMiddleware = cors({
  origin: "https://task-management-saas-mini-clickup-2.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
export default corsMiddleware;
