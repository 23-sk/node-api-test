const { createFirebaseUser, getAuthToken, verifyAuthToken } = require('../config/firebase');
const { Account, validateUserPost, validateUserPut } = require('../models/accountModel');
const { encryptPassword } = require('../utils/encrypt');
const { Op } = require("sequelize");


exports.createAccount = async (req, res) => {
    try {
        const { error } = validateUserPost(req.body); // Joi Validation
        if (error) return res.status(400).send({ message: "Failure", data: { message: error.details[0].message } });

        const { first_name, last_name, email, phone, password, birthday } = req.body;
        let existing = await Account.findAll({ where: { [Op.or]: [{email: email}, {phone: phone}] } });
        if (existing.length > 0) return res.status(400).send({ message: "Failure", data: { message: "Account already exists" } });
        
        let firebaseUser = await createFirebaseUser(email, password);
        if (!firebaseUser) return res.status(400).send({ message: "Failure", data: { message: "Error creating the user" } });

        let encryptedPassword = await encryptPassword(password);
        const account = await Account.create({ first_name, last_name, email, phone, password: encryptedPassword, birthday });
  
        return res.status(201).json(account);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
};

exports.getAccounts = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const accounts = await Account.findAll({ limit });
      res.status(200).json(accounts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.getAccount = async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
      const { error } = validateUserPut(req.body); // Joi Validation
      if (error) return res.status(400).send({ message: "Failure", data: { message: error.details[0].message } });

      const { first_name, last_name, email, phone, birthday } = req.body;
      const account = await Account.findByPk(req.params.id);
      if (account) {
        account.first_name = first_name;
        account.last_name = last_name;
        account.birthday = birthday;
        account.last_modified = new Date();
        await account.save();
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
      const account = await Account.findByPk(req.params.id);
      if (account) {
        await account.destroy();
        res.status(200).json({ message: 'Account deleted successfully' });
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let token = await getAuthToken(email);
    if (!token) res.status(400).json({ error: error.message });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) throw new Error('Access denied');
    let decodedToken = await verifyAuthToken(token);
    if (!decodedToken) res.status(401).json({ error: 'Invalid token' });
    req.userData = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};