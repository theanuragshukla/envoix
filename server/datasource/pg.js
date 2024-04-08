const { DataSource } = require("typeorm");

const pgDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: [
    require("../entities/user.entitiy"),
    require("../entities/envs.entitiy"),
    require("../entities/envPermission.entity"),
  ],
  logging: true,
  synchronize: true,
});

module.exports = { pgDataSource };
