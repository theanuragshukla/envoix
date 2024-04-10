const { EntitySchema } = require("typeorm");

const envPermissions = new EntitySchema({
  name: "envPermissions",
  tableName: "envPermissions",
  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    env_id: {
      type: "uuid",
    },
    user_email: {
      type: "text",
    },
    permission: {
      type: "enum",
      enum: ["push", "pull", "admin", "add_user", "remove_user"],
      array: true,
    },
    kek: {
      type: "text",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
    password_changed: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    environment: {
      target: "envs",
      type: "many-to-one",
      joinColumn: { name: "env_id", referencedColumnName: "env_id" },
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});

module.exports = envPermissions;
