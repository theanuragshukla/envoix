const { body } = require("express-validator");

const loginSchema = [
  body("email").isEmail().withMessage("Incorrect email"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be at least 8 and no more than 128 characters"),
];

module.exports = { loginSchema };
