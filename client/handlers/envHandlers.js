import path from "path";
import fs from "fs";
import inquirer from "inquirer";

import { isLoggedIn } from "../config/index.js";
import {
  createEnv,
  getAllEnvs,
  pullEnv,
  updateEnv,
} from "../data/managers/envs.js";
import { createConfigFile, printColor } from "../utils.js";

export const getAllEnvsHandler = async () => {
  const { status, data, msg } = await getAllEnvs();
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "📦 Available environments");
  data.forEach(({ name, env_path, env_id }) => {
    printColor("yellow", `\n| Name: ${name}`);
    printColor("yellow", `| Env path: ${env_path}`);
    printColor("yellow", `| ID: ${env_id}`);
    printColor("blue", "-------------------");
  });
};
export const pullEnvHandler = async () => {
  if (!isLoggedIn()) {
    console.log("You need to login to pull environment variables");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    printColor("red", "❌ envmon repository not initialized");
    return;
  }
  const { id, env_location } = JSON.parse(fs.readFileSync(configPath));
  const { status, data, msg } = await pullEnv({ id });
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  const { env_data } = data;
  const filePath = path.join(process.cwd(), env_location);
  fs.writeFileSync(filePath, env_data, "utf-8");
  printColor("green", "✅ Environment variables pulled successfully");
};

export const pushEnvHandler = async () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login to push environment variables");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (!fs.existsSync(configPath)) {
    printColor("red", "❌ envmon repository not initialized");
    return;
  }
  const { id, env_location } = JSON.parse(fs.readFileSync(configPath));
  const env_data = fs.readFileSync(path.join(process.cwd(), env_location), {
    encoding: "utf-8",
  });
  const { status, msg } = await updateEnv({ id, env_data });
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  printColor("green", "✅ Environment variables pushed successfully");
};

export const initHandler = async () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login before initializing envmon");
    return;
  }
  const configPath = path.join(process.cwd(), "envmon-config.json");
  if (fs.existsSync(configPath)) {
    printColor("yellow", "👉 envmon repository already initialized");
    return;
  }

  printColor("green", "🚀 Initializing envmon repository");
  const { name, env_path, password } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter project name:",
      default: "project",
    },
    {
      type: "input",
      name: "env_path",
      message: "Enter relative path to env file :",
      default: "./.env",
    },
    { type: "password", name: "password", message: "Enter your password:" },
  ]);

  printColor("green", "⚡Creating envmon repository");

  const filePath = path.join(process.cwd(), env_path);
  if (!fs.existsSync(filePath)) {
    printColor("red", "👉 Environment file not found, creating one...");
    fs.writeFileSync(filePath, "");
  }
  const response = await createEnv({ name, env_path, password });
  const { status, data, msg } = response;
  if (!status) {
    printColor("red", `❌ ${msg}`);
    return;
  }
  createConfigFile(data);
  printColor("green", "✅ envmon repository initialized successfully");
};
