const { EntitySchema } = require("typeorm");

const envs = new EntitySchema({
  name: "envs",
  tableName: "envs",
  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    env_id: {
      type: "uuid",
      unique: true,
    },
    env_path: {
      type: "text",
    },
    name: {
      type: "text",
    },
    env_data: {
      type: "text",
      default: "",
    },
    owner: {
      type: "varchar",
      length: 16,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "owner", referencedColumnName: "uid" },
      cascade: true,
    },
  },
});

module.exports = envs;
