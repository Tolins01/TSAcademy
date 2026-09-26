const express = require('express');
const router = express.Router();
const { createBank } = require('../Controllers/CreateBankController');

router.post('/', createBank);

module.exports = router;
