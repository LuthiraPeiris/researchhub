import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      decoded should contain user details from login token.
      Example:
      {
        user_id: 1,
        email: "admin@gmail.com",
        role: "admin"
      }
    */
    req.user = {
      user_id: decoded.user_id || decoded.id,
      id: decoded.id || decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Admin authorization failed",
    });
  }
};