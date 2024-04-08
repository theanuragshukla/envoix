const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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
    console.log(err);
    res
      .status(401)
      .json({ status: false, msg: "Unauthorized", errors: err.message });
  }
};

module.exports = authMiddleware;
