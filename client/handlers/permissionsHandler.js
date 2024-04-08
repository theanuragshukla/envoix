import inquirer from "inquirer";
import path from "path";
import fs from "fs";

import { addUser, allPermissions, removeUser, updateUser } from "../data/managers/permissions.js";
import { printColor } from "../utils.js";
import { isLoggedIn } from "../config/index.js";

export const addUserHandler = async () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login to add a user");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    printColor("red", "❌ envmon repository not initialized");
    return;
  }
  const { id } = JSON.parse(fs.readFileSync(configPath));
  const { user_email, permission } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
    {
      type: "checkbox",
      name: "permission",
      message: "Select permissions",
      choices: ["push", "pull", "admin", "add_user", "remove_user"],
    },
  ]);
  const { status, msg } = await addUser({
    id,
    values: {
      user_email,
      permission,
    },
  });

  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "✅ User added successfully");
};
export const removeUserHandler = async () => {
  if (!isLoggedIn()) {
    console.log("You need to login to remove a user");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    console.log("envmon repository not initialized");
    return;
  }
  const { id } = JSON.parse(fs.readFileSync(configPath));
  const { user_email } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
  ]);
  const { status, msg } = await removeUser({ id, values: { user_email } });
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "✅ User removed successfully");
};

export const allPermissionsHandler = async () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login to view permissions");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    printColor("red", "❌ envmon repository not initialized");
    return;
  }
  const { id } = JSON.parse(fs.readFileSync(configPath));
  const { status, data, msg } = await allPermissions({ id });
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "🔒 Permissions");
  data.forEach(({ user_email, permission }) => {
    printColor("yellow", `| User: ${user_email}`);
    printColor("yellow", `| Permissions: ${permission.join(", ")}`);
    printColor("blue", "-------------------");
  });
};

export const updateUserHandler = async () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login to update a user");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    printColor("red", "❌ envmon repository not initialized");
    return;
  }
  const { id } = JSON.parse(fs.readFileSync(configPath));
  const { user_email, permission } = await inquirer.prompt([
    { type: "input", name: "user_email", message: "Enter user email:" },
    {
      type: "checkbox",
      name: "permission",
      message: "Select permissions",
      choices: ["push", "pull", "admin", "add_user", "remove_user"],
    },
  ]);
  const { status, msg } = await updateUser({
    id,
    values: { user_email, permission },
  });
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "✅ User updated successfully");
};
