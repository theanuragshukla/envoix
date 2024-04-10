import Conf from "conf";
import chalk from "chalk";

import { PROJECT_NAME } from "../constants.js";
import { printColor } from "../utils.js";

export const config = new Conf({
  projectName: PROJECT_NAME,
  schema: {
    profile: {
      type: "object",
      properties: {
        name: { type: "string", default: "" },
        email: { type: "string", default: "" },
        uid: { type: "string", default: "" },
      },
    },
    authtoken: { type: "string", default: "" },
  },
});

export const getConfig = () => {
  return config.store;
};

export const logout = () => {
  config.clear();
  console.log(chalk.green(""));
  printColor("green", "✅ Logged out successfully");
};

export const setProfile = (profile) => {
  config.set("profile", profile);
};

export const setAuthToken = (token) => {
  config.set("authtoken", token);
};

export const getAuthToken = () => {
  return config.get("authtoken");
};
export const getProfile = () => {
  return config.get("profile");
};

export const isLoggedIn = () => {
  return !!config.get("authtoken");
};
