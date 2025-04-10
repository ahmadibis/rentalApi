/** @format */

const bcrypt = require('bcrypt');

const saltRounds = 10; // the higher, the more secure but slower

async function hashPassword(plainTextPassword) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(plainTextPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  return isMatch;
}

module.exports.hashPassword = hashPassword;
module.exports.verifyPassword = verifyPassword