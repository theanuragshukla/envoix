const crypto = require("crypto");
const { createHash } = require("./utilFuncs");

class EncryptionService {
  _algo = "aes-256-cbc";
  encrypt(data, key, iv) {
    const cipher = crypto.createCipheriv(
      this._algo,
      createHash(key, 32),
      createHash(iv, 16)
    );
    let data_enc = cipher.update(data, "utf8", "hex");
    data_enc += cipher.final("hex");
    return data_enc;
  }
  decrypt(data_enc, key, iv) {
    const decipher = crypto.createDecipheriv(
      this._algo,
      createHash(key, 32),
      createHash(iv, 16)
    );
    let data = decipher.update(data_enc, "hex", "utf8");
    data += decipher.final("utf8");
    return data;
  }
}
module.exports = EncryptionService;
