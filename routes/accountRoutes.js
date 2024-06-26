const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.post('/create', accountController.createAccount);
router.post('/login', accountController.login);

router.use(accountController.verifyToken);

router.get('/', accountController.getAccounts);
router.get('/:id', accountController.getAccount);
router.put('/:id', accountController.updateAccount);
router.delete('/:id', accountController.deleteAccount);

module.exports = router;