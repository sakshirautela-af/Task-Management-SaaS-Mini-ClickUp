export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: user identity not verified",
      });
    }
    const userRole = req.user.role || "USER";
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: requires one of the following roles: [${roles.join(", ")}]. Current role: ${userRole}`,
      });
    }
    next();
  };
};
