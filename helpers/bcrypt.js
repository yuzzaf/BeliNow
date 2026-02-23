const bcrypt = require("bcrypt");

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, comparePassword };
