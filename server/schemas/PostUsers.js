const { body } = require("express-validator");

const addUserSchema = [
  body("name")
    .isLength({ min: 1, max: 32 })
    .withMessage("Name must be at least 8 and no more than 32 characters"),
  body("email").isEmail().withMessage("Incorrect email"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be at least 8 and no more than 128 characters"),
];

module.exports = { addUserSchema };
