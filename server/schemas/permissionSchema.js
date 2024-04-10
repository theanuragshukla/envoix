const { body } = require("express-validator");

const permissionSchema = [
  body("user_email").isEmail().withMessage("Incorrect email"),
  body("permission")
    .isArray({ min: 1 })
    .withMessage("provide at least one permission"),
  body("otp"),
  body("password")
];

module.exports = { permissionSchema };
