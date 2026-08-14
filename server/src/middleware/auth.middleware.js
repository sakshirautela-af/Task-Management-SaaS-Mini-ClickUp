import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // const authHeader = req.query.token;
  // if (!token) {
  //   return res.status(401).json({ message: 'Authorization token missing or invalid' });
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded; 
  // } catch (error) {
  //   return res.status(401).json({ message: 'Token is invalid or expired' });
  // }

  // Bypass authentication for now
  next();
};
