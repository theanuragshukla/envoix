import path from "path";
import fs from "fs";
import inquirer from "inquirer";

import {
  createEnv,
  deleteEnv,
  getAllEnvs,
  pullEnv,
  updateEnv,
} from "../data/managers/envs.js";
import {
  createConfigFile,
  printColor,
  checkLoginStatus,
  validateConfig,
  apiResponseHandler,
} from "../utils.js";
import { CONFIG_FILE, PROJECT_NAME } from "../constants.js";

export const deleteEnvHandler = async () => {
  if (!checkLoginStatus()) return;
  const { id } = validateConfig();
  if (!id) return;
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to delete this environment?",
    },
  ]);
  if (!confirm) {
    printColor("red", "❌ Delete operation aborted");
    return;
  }
  const response = await deleteEnv({ id });
  apiResponseHandler(response, () => {
    printColor("green", "✅ Environment deleted successfully");
  });
};

export const getAllEnvsHandler = async () => {
  const response = await getAllEnvs();
  apiResponseHandler(response, (data) => {
    printColor("green", "📦 Available environments");
    data.forEach(({ name, env_path, env_id }) => {
      printColor("yellow", `\n| Name: ${name}`);
      printColor("yellow", `| Env path: ${env_path}`);
      printColor("yellow", `| ID: ${env_id}`);
      printColor("blue", "-------------------");
    });
  });
};

export const pullEnvHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id, env_location } = envContent;
  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);
  const response = await pullEnv({ id, password });
  apiResponseHandler(
    response,
    ({ env_data }) => {
      const filePath = path.join(process.cwd(), env_location);
      fs.writeFileSync(filePath, env_data, "utf-8");
      printColor("green", "✅ Environment variables pulled successfully");
    },
    async (response) => {
      const { code } = response;
      if (code === 400) {
        const { oneTimePassword } = await inquirer.prompt([
          {
            type: "input",
            name: "oneTimePassword",
            message: "Enter one time password:",
          },
        ]);

        const response = await pullEnv({ id, oneTimePassword, password });
        apiResponseHandler(response, ({ env_data }) => {
          const filePath = path.join(process.cwd(), env_location);
          fs.writeFileSync(filePath, env_data, "utf-8");
          printColor("green", "✅ Environment variables pulled successfully");
        });
      } else {
        printColor("red", `❌ ${response.msg}`);
        return;
      }
    }
  );
};

export const pushEnvHandler = async () => {
  const envContent = validateConfig();
  if (!envContent) return;
  const { id, env_location } = envContent;
  const env_data = fs.readFileSync(path.join(process.cwd(), env_location), {
    encoding: "utf-8",
  });

  const { password } = await inquirer.prompt([
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);
  const response = await updateEnv({ id, values: { env_data, password } });
  apiResponseHandler(response, () => {
    printColor("green", "✅ Environment variables pushed successfully");
  });
};

export const initHandler = async () => {
  if (!checkLoginStatus()) return;
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    printColor("red", `👉 ${PROJECT_NAME} repository already initialized`);
    return;
  }

  printColor("green", `🚀 Initializing ${PROJECT_NAME} repository`);
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

  printColor("green", `⚡Creating ${PROJECT_NAME} repository`);

  const filePath = path.join(process.cwd(), env_path);
  if (!fs.existsSync(filePath)) {
    printColor("red", "👉 Environment file not found, creating one...");
    fs.writeFileSync(filePath, "");
  }
  const response = await createEnv({ name, env_path, password });
  apiResponseHandler(response, () => {
    createConfigFile({ env_id: response.data.env_id, name, env_path });
    printColor("green", `✅ ${PROJECT_NAME} repository created successfully`);
  });
};
