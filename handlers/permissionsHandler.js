import inquirer from "inquirer";

import {
  addUser,
  allPermissions,
  removeUser,
  updateUser,
} from "../data/managers/permissions.js";
import { apiResponseHandler, printColor, validateConfig } from "../utils.js";

export const addUserHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id } = envContent;
  const { user_email, permission, otp, password } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
    {
      type: "checkbox",
      name: "permission",
      message: "Select permissions",
      choices: ["push", "pull", "admin", "add_user", "remove_user"],
    },
    {
      type: "input",
      name: "otp",
      message: "Enter OTP:",
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);
  const response = await addUser({
    id,
    values: {
      user_email,
      permission,
      password,
      otp,
    },
    otp,
  });

  apiResponseHandler(response, () => {
    printColor("green", "✅ User added successfully");
  });
};
export const removeUserHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id } = envContent;
  const { user_email } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
  ]);
  const response = await removeUser({ id, values: { user_email } });
  apiResponseHandler(response, () => {
    printColor("green", "✅ User removed successfully");
  });
};

export const allPermissionsHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id } = envContent;
  const response = await allPermissions({ id });
  apiResponseHandler(response, (data) => {
    printColor("green", "🔒 Permissions");
    data.forEach(({ user_email, permission }) => {
      printColor("yellow", `| User: ${user_email}`);
      printColor("yellow", `| Permissions: ${permission.join(", ")}`);
      printColor("blue", "-------------------");
    });
  });
};

export const updateUserHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id } = envContent;
  const { user_email, permission } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
    {
      type: "checkbox",
      name: "permission",
      message: "Select permissions",
      choices: ["push", "pull", "admin", "add_user", "remove_user"],
    },
  ]);
  const response = await updateUser({
    id,
    values: { user_email, permission },
  });
  apiResponseHandler(response, () => {
    printColor("green", "✅ User updated successfully");
  });
};
