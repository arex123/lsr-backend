import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
    );

    // Add userId to request object
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    
    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// Optional: Middleware to get user info from token without requiring authentication
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
      );
      req.userId = decoded.userId;
    }
    next();
  } catch (error) {
    // If token is invalid, just continue without authentication
    next();
  }
};

