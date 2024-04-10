const { body } = require("express-validator");

const accessEnvSchema = [
  body("password"), 
  body("oneTimePassword")
];

module.exports = { accessEnvSchema };
