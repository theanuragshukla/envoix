#!/usr/bin/env node

import { program } from "commander";

import { logout } from "./config/index.js";
import {
  loginHandler,
  profileHandler,
  signupHandler,
} from "./handlers/authHandlers.js";
import {
  deleteEnvHandler,
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

program.description(
  "envoix is CLI tool for providing easy and secure way to share environment variables among teams and developers"
);
// Auth handling

const auth = program.command("auth").description("Authentication commands");

auth
  .command("signup")
  .description("Sign up for a new account")
  .action(signupHandler);
auth
  .command("login")
  .description("Log in to your account")
  .action(loginHandler);
auth.command("profile").description("Get your details").action(profileHandler);
auth.command("logout").description("Log out of your account").action(logout);

// Environment handling

program
  .command("init")
  .description("Initialize new environment")
  .action(initHandler);
program
  .command("list")
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
program
  .command("delete")
  .description("Delete environment")
  .action(deleteEnvHandler);

// Permission handling

const user = program.command("user").description("Handle user permissions");
user
  .command("add")
  .description("Add new user to the current project")
  .action(addUserHandler);
user
  .command("remove")
  .description("Remove all permissions from a user")
  .action(removeUserHandler);
user
  .command("list")
  .description("get all users and permissions for current project")
  .action(allPermissionsHandler);
user
  .command("update")
  .description("update permissions for a user")
  .action(updateUserHandler);
program.parse(process.argv);
