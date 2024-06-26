const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Joi = require("joi");

const Account = sequelize.define('Account', {
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  phone: { type: DataTypes.STRING(16), allowNull: false },
  password: { type: DataTypes.STRING(100), allowNull: false },
  birthday: { type: DataTypes.DATEONLY, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  last_modified: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
});


function validateUserPost(user) {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().allow(""),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().min(1).max(40).email().required(),
    password: Joi.string()
      .min(8)
      .max(40)
      .required()
      .error(() => {
        return {
          message: "Password length must be at least 8 characters long"
        };
      }),
    birthday: Joi.string().required()
  });
  return schema.validate(user);
}

function validateUserPut(user) {
  const schema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    birthday: Joi.string()
  });
  return schema.validate(user);
}


module.exports.Account = Account;
module.exports.validateUserPost = validateUserPost;
module.exports.validateUserPut = validateUserPut;
