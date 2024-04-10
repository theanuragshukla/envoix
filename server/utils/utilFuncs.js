const crypto = require("crypto");
const { CIPHER_PREFIX } = require("../constants");

const generateRandomString = (length = 16) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createHash = (str, len) => {
  return crypto
    .createHash("sha512")
    .update(CIPHER_PREFIX)
    .update(str)
    .digest()
    .toString("hex")
    .substring(0, len);
};

module.exports = { generateRandomString, createHash };
