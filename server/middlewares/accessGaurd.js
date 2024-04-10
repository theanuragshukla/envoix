function accessGaurd(roles = ["admin"]) {
  return (req, res, next) => {
    if (!!req.permissions) {
      if (typeof req.permissions?.permission !== "object")
        return res.json({ status: false, msg: "Permission denied" });

      if (req.permissions.permission.includes("admin")) return next();

      for (let role of roles) {
        if (!req.permissions.permission.includes(role)) {
          return res.json({ status: false, msg: "Permission denied" });
        }
      }
    } else {
      return res.json({ status: false, msg: "Permission denied" });
    }
    next();
  };
}
module.exports = accessGaurd;
