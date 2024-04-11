# Envoix

Envoix is a command line tool that facilitates easy and secure sharing of Environment variables among developers and teams. 
It removes the overhead of sending env variables to each developer in your team personally over social media, and make sure that everyone is in sync, while not leaving your terminal.

## Features

1. easy user authentication
2. easy setup (just one command)
3. remote storage for all the variables
4. Encrypted (coming soon)
5. Add other users to the project
6. Manage User Permissions (Push, Pull, Admin, Add_Users, Remove_Users)
7. No hassles with GUI

## Prerequisites

- Nodejs (v18+)
- npm

## Getting started

1. Install the npm package globally
```sh
    sudo npm i -g envoix
```
2. Create new account or log in to previous account if you have one already
```sh
    envoix auth signup 

```
OR 
```sh
    envoix auth login
```

3. You are all set to start using envoix in your projects

## Usage

```sh
Usage: envoix [options] [command]

envoix is CLI tool for providing easy and secure way to share environment
variables among teams and developers

Options:
  -h, --help      display help for command

Commands:
  auth            Authentication commands
  init            Initialize new environment
  list            Get all environments
  pull            Pull environment variables
  push            Push environment files to server
  delete          Delete environment
  user            Handle user permissions
  help [command]  display help for command

```
### Auth
This command includes all the authentication related subcommands

- Login: `envoix auth login`
    - email
    - password

- Signup: `envoix auth signup`
    - name
    - email
    - password

- Profile: `envoix auth profile`

- Logout: `envoix auth logout`

### User Permissions
- This commands follows various subcommands for managing user permissions on the environment
- The permissions allowed can be any combination of the following list of permissions:
    - pull: Read the current environment variables from the server
    - push: Change/Update the environment variables on the server
    - add_user: Add a new user with certain set of permissions
    - remove_user: Remove a user and their permissions
    - update_user: Update other user permissions 
    - admin: All the above permissions + some extra ones
        - list all users with permission
        - delete the environment


#### Usage
- Add User: `envoix user add`
    - email
    - permissions
    - OTP ([read more](#Security))

- Remove User: `envoix user remove`
    - email

- Update User: `envoix user update`
    - email
    - permissions

- List Users: `envoix user list`

### Environment Settings
- These are the core features of this library which provides functionality for managing environments
    - init: Create a new environment config
    - push: Push the current config to server
    - pull: Pull the changes from server
    - list: List all the environment created by current user
    - delete: Delete current environment

#### Usage

all the below subcommands requires user to confirm their password

- Init: `envoix init`
    - Project name
    - env file's relative location

- Push: `envoix push`

- Pull: `envoix pull`

- List: `envoix list`

- Delete: `envoix delete`


# Security

The biggest concern of a user is security. Envoix gaurantees that all the user data including: 
- password
- environment variables
are securly stored (encrypted or hashed) on the server.

### Password

The user's password is the most important asset in securing other relevant data, so it should be stored securly.
- User's password is not stored on server either in plain text or any other encrypted form
- bcrypt is used to hash the password and store the resulting hash in db.

### Environment Variables/data

Here comes the fun part, 
> It took me more days to seecurly store the env variables than coding all the other features

Okay, so what's the keyword here ?? Its `key wrapping`

#### Why key wrapping ?

let's analyze our requirements:
1. Secure
2. Encryption and Decryption by more than one user
3. Not storing the key(encryption/decryption) on the server

Considering above requirements, we don't have a lot of options.
1. RSA key pair / Asymmetric encryption
    - It can implemented here but it also comes with certain limitations
        - User can't move between devices(easily)
        - Need to store public keys for each device of user for each user

2. Other symmetric encryptions (password sharing, pke challenges, etc)
    - Not suitable for this use case

3. Key wrapping

#### Implementing Key wrapping algorithm
> all the encryption is done using `aes-256-cbc` and all the hashing is done using `sha-512` algorithms

1. When a new environment is initialised, An encryption key called Master Encryption Key(`MEK`) is generated on the server
2. MEK is used to encrypt/decrypt data using push/pull actions
3. encrypt the MEK using user's plain-text password passed for verification during `init` action
4. encrypted MEK(eMEK) or Key Encryption key(KEK) is stored in a table alongside user's permissions

5. When a new user(X) is added by an User(Y) with `admin` or `add_user` privilages, 
```js
    - MEK = decrypt(KEK(Y), pass_Y)
    - KEK(X) = encrypt(MEK, otp)
    - store it alongside permissions of User(X)
```
> Used otp to create kek(X) because we don't have pass_X

6. During the first pull from the user_X, OTP is also asked and then `KEK(X)` is replaced by `encrypt(MEK, pass_X)`

7. Afterwards, Each push/pull action is performed by derived MEK from User's KEK.
