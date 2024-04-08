const Router = require("express").Router;
const { validationResult } = require("express-validator");

const { validate } = require("../utils/validate");
const { addEnvSchema } = require("../schemas/addEnvSchema");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const db = require("../datasource/pg");

const envRouter = Router();

envRouter.get("/all", async (req, res) => {
  const envs = await db.pgDataSource
    .getRepository("envs")
    .findBy({ owner: req.user.uid });
  res.json({ status: true, msg: "All environments", data: envs });
});

envRouter.post("/add", validate(addEnvSchema), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      status: false,
      msg: "Validation error",
      errors: errors.array(),
    });
  }
  const { name, env_data, env_path } = req.body;

  let env;

  await db.pgDataSource.manager.transaction(async (manager) => {
    env = await manager
      .getRepository("envs")
      .save({ name, env_path, env_data, owner: req.user.uid });
    await manager.getRepository("envPermissions").save({
      env_id: env.env_id,
      permission: ["admin"],
      user_email: req.user.email,
    });
  });

  res.json({
    status: true,
    msg: "Environment added",
    data: {
      env_id: env.env_id,
      name: env.name,
      env_path: env.env_path,
      env_data: env.env_data,
    },
  });
});

envRouter.use(permissionMiddleware);

envRouter.get("/:env_id", async (req, res) => {
  if (!req.permissions) {
    console.log(req.permissions);
    return res.json({ status: false, msg: "Permission denied" });
  }
  if (
    req.permissions.permission.includes("pull") ||
    req.permissions.permission.includes("admin")
  ) {
    const env = await db.pgDataSource
      .getRepository("envs")
      .findOneBy({ env_id: req.params.env_id });
    return res.json({ status: true, msg: "Environment", data: env });
  }
});

envRouter.post("/:env_id/permissions/add", async (req, res) => {
  if (
    !req.permissions ||
    !(
      req.permissions.permission.includes("add_user") ||
      req.permissions.permission.includes("admin")
    )
  ) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  const { user_email, permission } = req.body;
  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id });
  if (!env) {
    return res.json({ status: false, msg: "Environment not found" });
  }
  const permissions = await db.pgDataSource
    .getRepository("envPermissions")
    .findOneBy({ env_id: req.params.env_id, user_email });
  if (permissions) {
    return res.json({ status: false, msg: "Permission already exists" });
  }
  await db.pgDataSource
    .getRepository("envPermissions")
    .save({ env_id: req.params.env_id, user_email, permission });
  res.json({ status: true, msg: "Permission added" });
});

envRouter.post("/:env_id/permissions/update", async (req, res) => {
  if (
    !req.permissions ||
    !(
      req.permissions.permission.includes("update_user") ||
      req.permissions.permission.includes("admin")
    )
  ) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  const { user_email, permission } = req.body;
  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id });
  if (!env) {
    return res.json({ status: false, msg: "Environment not found" });
  }
  const permissions = await db.pgDataSource
    .getRepository("envPermissions")
    .findOneBy({ env_id: req.params.env_id, user_email });
  if (!permissions) {
    return res.json({ status: false, msg: "Permission not found" });
  }
  await db.pgDataSource
    .getRepository("envPermissions")
    .update({ env_id: req.params.env_id, user_email }, { permission });
  res.json({ status: true, msg: "Permission updated" });
});

envRouter.post("/:env_id/permissions/remove", async (req, res) => {
  if (
    !req.permissions ||
    !(
      req.permissions.permission.includes("remove_user") ||
      req.permissions.permission.includes("admin")
    )
  ) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  const { user_email } = req.body;
  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id });
  if (!env) {
    return res.json({ status: false, msg: "Environment not found" });
  }
  const permissions = await db.pgDataSource
    .getRepository("envPermissions")
    .findOneBy({ env_id: req.params.env_id, user_email });
  if (!permissions) {
    return res.json({ status: false, msg: "Permission not found" });
  }
  await db.pgDataSource
    .getRepository("envPermissions")
    .delete({ env_id: req.params.env_id, user_email });
  res.json({ status: true, msg: "Permission removed" });
});

envRouter.post("/:env_id/update", async (req, res) => {
  if (
    !req.permissions ||
    !(
      req.permissions.permission.includes("admin") ||
      req.permissions.permission.includes("push")
    )
  ) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  const { name, env_data } = req.body;
  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id });
  if (!env) {
    return res.json({ status: false, msg: "Environment not found" });
  }
  await db.pgDataSource
    .getRepository("envs")
    .update({ env_id: req.params.env_id }, { name, env_data });
  res.json({ status: true, msg: "Environment updated" });
});

envRouter.get("/:env_id/delete", async (req, res) => {
  if (!req.permissions || !req.permissions.permission.includes("admin")) {
    return res.json({ status: false, msg: "Permission denied" });
  }
  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id, owner: req.user.uid });
  if (!env) {
    return res.json({ status: false, msg: "Environment not found" });
  }
  await db.pgDataSource
    .getRepository("envs")
    .delete({ env_id: req.params.env_id });
  res.json({ status: true, msg: "Environment deleted" });
});

envRouter.get("/:env_id/permissions", async (req, res) => {
  if (!req.permissions || !req.permissions.permission.includes("admin")) {
    return res.json({ status: false, msg: "Permission denied" });
  }

  const env = await db.pgDataSource
    .getRepository("envs")
    .findOneBy({ env_id: req.params.env_id, owner: req.user.uid });

  if (!env) {
    return res.json({ status: false, msg: "Permission denied" });
  }

  const permissions = await db.pgDataSource
    .getRepository("envPermissions")
    .findBy({ env_id: req.params.env_id });
  res.json({
    status: true,
    msg: "Permissions",
    data: permissions.map((obj) => ({
      user_email: obj.user_email,
      permission: obj.permission,
    })),
  });
});

module.exports = envRouter;
