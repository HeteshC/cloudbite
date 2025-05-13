const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// 🔓 Middleware to optionally verify user if token exists
exports.verifyTokenOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null; // 👈 allow guests
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null; // 👈 allow guests
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
