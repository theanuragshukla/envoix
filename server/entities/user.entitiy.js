const EntitySchema = require("typeorm").EntitySchema;

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    _id: {
      primary: true,
      type: "int",
      generated: true,
    },
    uid: {
      type: "varchar",
      length: 16, 
      unique: true,
    },
    name: {
      type: "varchar",
      length: 32,
    },
    email: {
      type: "text",
      unique: true,
    },
    password: {
      type: "text",
    },
  },
});

module.exports = User;
