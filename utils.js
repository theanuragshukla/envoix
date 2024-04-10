import chalk from "chalk";
import path from "path";
import fs from "fs";

import { CONFIG_FILE, PROJECT_NAME } from "./constants.js";
import { isLoggedIn } from "./config/index.js";

export const printColor = (color, msg) => {
  console.log(chalk[color](msg));
};

export const createConfigFile = async ({ env_id, name, env_path }) => {
  const config = {
    id: env_id,
    name: name,
    env_location: env_path,
  };
  const filePath = path.join(process.cwd(), CONFIG_FILE);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
};

export const checkLoginStatus = () => {
  if (!isLoggedIn()) {
    printColor("red", "👉 You need to login to perform this action");
    return false;
  }
  return true;
};

export const checkIfInit = () => {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    printColor("red", `❌ ${PROJECT_NAME} repository not initialized`);
    return false;
  }
  return true;
};

export const parseConfigFile = () => {
  try {
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    return JSON.parse(fs.readFileSync(configPath));
  } catch (e) {
    return null;
  }
};

export const validateConfig = () => {
  if (!checkLoginStatus()) return false;
  if (!checkIfInit()) return false;
  const { id, env_location } = parseConfigFile();
  if (!id || !env_location) {
    printColor("red", "❌ Invalid config file");
    return false;
  }

  return { id, env_location };
};

export const apiResponseHandler = (
  response,
  successHandler,
  failureHandler = ({msg}) => {
    printColor("red", `❌ ${msg}`);
    return;
  }
) => {
  const { status, data } = response;
  if (!status) {
    return failureHandler(response);
  }
  successHandler(data);
};
