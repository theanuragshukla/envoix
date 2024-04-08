const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token) {
      return res.status(401).json({ status: false, msg: "Unauthorized" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ status: false, msg: "Unauthorized" });
  }
}

module.exports = authMiddleware
