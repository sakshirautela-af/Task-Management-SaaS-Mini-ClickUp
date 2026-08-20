import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && (parts[0] === "Bearer" || parts[0] === "bearer")) {
        token = parts[1];
      } else {
        token = req.headers.authorization;
      }
    } else if (req.headers["x-access-token"]) {
      token = req.headers["x-access-token"];
    } else if (req.headers.token) {
      token = req.headers.token;
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }
    if (!token) {
      return res.status(401).json({
        message: "Authorization token missing or invalid",
      });
    }
    const secret = process.env.JWT_SECRET || "default_secret_key";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token is invalid or expired",
      error: error.message,
    });
  }
};
