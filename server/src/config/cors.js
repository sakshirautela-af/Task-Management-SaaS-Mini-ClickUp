import cors from "cors";
export const corsMiddleware = cors({
  origin: "https://task-management-saa-s-mini-click-up.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
export default corsMiddleware;
