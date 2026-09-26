const express = require('express');
const router = express.Router();
const { createAccount, getAccountById } = require('../Controllers/AccountController');
const protect = require('../Middlewares/auth');

router.post('/', protect, createAccount);
router.get('/:id', protect, getAccountById);

module.exports = router;
