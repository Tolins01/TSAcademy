const express = require('express');
const router = express.Router();

const {generateToken,insertBvn,insertNin} = require('../Controllers/ApiController');

router.post('/token', generateToken);
router.post('/insertBvn', insertBvn);
router.post('/insertNin', insertNin);

module.exports = router;
