const permissionMiddleware = async (req, res, next) => {
  const permissions = await db.pgDataSource
    .getRepository("envPermissions")
    .findOneBy({ env_id: req.params.env_id, user_email: req.user.email });
  req.permsissions = permissions;
  if (!permissions) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  next();
};

module.exports = permissionMiddleware;
