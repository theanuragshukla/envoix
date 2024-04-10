const Router = require("express").Router;
const { validationResult } = require("express-validator");
const crypto = require("crypto");

const { validate } = require("../utils/validate");
const { addEnvSchema } = require("../schemas/addEnvSchema");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const db = require("../datasource/pg");
const { accessEnvSchema } = require("../schemas/accessEnv");
const EncryptionService = require("../utils/encryption");
const accessGaurd = require("../middlewares/accessGaurd");
const permissionRouter = require("./permissionRouter");
const encFactory = new EncryptionService();

const envRouter = Router();

envRouter.get("/all", async (req, res, next) => {
  try {
    const envs = await db.pgDataSource
      .getRepository("envs")
      .findBy({ owner: req.user.uid });
    res.json({ status: true, msg: "All environments", data: envs });
  } catch (error) {
    next(error);
  }
});

envRouter.post("/add", validate(addEnvSchema), async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        status: false,
        msg: "Validation error",
        errors: errors.array(),
      });
    }
    const { name, env_data, env_path, password } = req.body;

    const envId = crypto.randomUUID();
    const mek = crypto.randomBytes(128).toString("hex");
    const env_data_enc = encFactory.encrypt(env_data || "", mek, envId);
    const kek = encFactory.encrypt(mek, password, req.user.uid);
    let env;

    await db.pgDataSource.manager.transaction(async (manager) => {
      env = await manager.getRepository("envs").save({
        env_id: envId,
        name,
        env_path,
        env_data: env_data_enc,
        owner: req.user.uid,
      });
      await manager.getRepository("envPermissions").save({
        env_id: envId,
        permission: ["admin"],
        user_email: req.user.email,
        kek,
        password_changed: true,
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
  } catch (error) {
    next(error);
  }
});

envRouter.use(permissionMiddleware);

envRouter.post(
  "/:env_id",
  validate(accessEnvSchema),
  accessGaurd(["pull"]),
  async (req, res, next) => {
    try {
      const { password, oneTimePassword } = req.body;

      const env = await db.pgDataSource
        .getRepository("envs")
        .findOneBy({ env_id: req.params.env_id });

      if (!env) {
        return res.json({ status: false, msg: "Environment not found" });
      }

      let mek;

      if (!req.permissions.password_changed) {
        if (!!oneTimePassword) {
          mek = encFactory.decrypt(
            req.permissions.kek,
            oneTimePassword,
            req.user.uid
          );

          const kek = encFactory.encrypt(mek, password, req.user.uid);
          await db.pgDataSource
            .getRepository("envPermissions")
            .update(
              { env_id: req.params.env_id, user_email: req.user.email },
              { kek, password_changed: true }
            );
        } else {
          return res
            .status(400)
            .json({ status: false, msg: "Password not changed" });
        }
      } else {
        mek = encFactory.decrypt(req.permissions.kek, password, req.user.uid);
      }

      const env_data = encFactory.decrypt(env.env_data, mek, req.params.env_id);
      env.env_data = env_data;

      env.env_data = env_data;
      return res.json({ status: true, msg: "Environment", data: env });
    } catch (error) {
      next(error);
    }
  }
);
envRouter.post(
  "/:env_id/update",
  validate(addEnvSchema),
  accessGaurd(["push"]),
  async (req, res, next) => {
    try {
      const { env_data, password } = req.body;

      const env = await db.pgDataSource
        .getRepository("envs")
        .findOneBy({ env_id: req.params.env_id });
      if (!env) {
        return res.json({ status: false, msg: "Environment not found" });
      }

      const mek = encFactory.decrypt(
        req.permissions.kek,
        password,
        req.user.uid
      );
      const env_data_enc = encFactory.encrypt(env_data, mek, req.params.env_id);
      await db.pgDataSource
        .getRepository("envs")
        .update({ env_id: req.params.env_id }, { env_data: env_data_enc });
      res.json({ status: true, msg: "Environment updated" });
    } catch (error) {
      next(error);
    }
  }
);

envRouter.get("/:env_id/delete", accessGaurd(), async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

envRouter.use(permissionRouter);

module.exports = envRouter;
