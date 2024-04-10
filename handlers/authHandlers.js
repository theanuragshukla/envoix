import inquirer from "inquirer";

import {
  getProfile,
  isLoggedIn,
  setAuthToken,
  setProfile,
} from "../config/index.js";
import { printColor } from "../utils.js";
import { login, signup } from "../data/managers/auth.js";

function handleLoginResponse(res) {
  const { status, data, msg } = res;
  if (!status) {
    printColor("red", msg);
    return;
  }
  const { name, email, uid, token } = data;
  setAuthToken(token);
  setProfile({ name, email, uid });
  printColor("green", "\n✅ Login successful");
}

export const signupHandler = async () => {
  if (isLoggedIn()) {
    printColor("green", `✅ Logged in as ${getProfile().email}`);
    printColor("blue", "👉 You need to logout before adding new account");
    return;
  }

  const { name, email, password } = await inquirer.prompt([
    { type: "input", name: "name", message: "Enter your name:" },
    { type: "input", name: "email", message: "Enter your email:" },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);

  const response = await signup({ name, email, password });
  handleLoginResponse(response);
};

export const loginHandler = async () => {
  if (isLoggedIn()) {
    printColor("green", `✅ Logged in as ${getProfile().email}`);
    printColor("blue", "👉 You need to logout before adding new account");
    return;
  }

  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email:" },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);
  const response = await login({ email, password });
  handleLoginResponse(response);
};
export const profileHandler = async () => {
  const profile = getProfile();
  if (!profile) {
    printColor("red", "👉 You need to login to view your profile");
    return;
  }
  printColor("green", "👤 User details");
  printColor("yellow", `\nName: ${profile.name}`);
  printColor("yellow", `Email: ${profile.email}`);
  printColor("yellow", `UID: ${profile.uid}`);
};
