const bcrypt = require('bcrypt');

exports.encryptPassword = async (password) => {
  const salt = process.env.SALT;
  return await bcrypt.hash(password, salt);
};