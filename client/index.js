#!/usr/bin/env node

import { program } from "commander";

import { logout } from "./config/index.js";
import {
  loginHandler,
  profileHandler,
  signupHandler,
} from "./handlers/authHandlers.js";
import {
  getAllEnvsHandler,
  initHandler,
  pullEnvHandler,
  pushEnvHandler,
} from "./handlers/envHandlers.js";
import {
  addUserHandler,
  allPermissionsHandler,
  removeUserHandler,
  updateUserHandler,
} from "./handlers/permissionsHandler.js";

// Auth handling

program
  .command("signup")
  .description("Sign up for a new account")
  .action(signupHandler);
program
  .command("login")
  .description("Log in to your account")
  .action(loginHandler);
program
  .command("profile")
  .description("Get user details")
  .action(profileHandler);
program.command("logout").description("Log out of your account").action(logout);

// Environment handling

program.command("init").description("Initialize the CLI").action(initHandler);
program
  .command("envs")
  .description("Get all environments")
  .action(getAllEnvsHandler);
program
  .command("pull")
  .description("Pull environment variables")
  .action(pullEnvHandler);
program
  .command("push")
  .description("Push environment files to server")
  .action(pushEnvHandler);

// Permission handling

program
  .command("add-user")
  .description("Add new user to the current project")
  .action(addUserHandler);
program
  .command("remove-user")
  .description("Remove all permissions from a user")
  .action(removeUserHandler);
program
  .command("permissions")
  .description("get all users and permissions for current project")
  .action(allPermissionsHandler);
program
  .command("update-user")
  .description("update permissions for a user")
  .action(updateUserHandler);
program.parse(process.argv);
