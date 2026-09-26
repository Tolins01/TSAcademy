const express = require('express');
const router = express.Router();

const { onboardCustomer, getCustomerProfile } = require('../Controllers/CustomerController');
const { loginCustomer } = require('../Controllers/AuthController');
const protect = require('../Middlewares/auth');

router.post('/create', onboardCustomer);
router.post('/login', loginCustomer);
router.get('/profile/:customer_id', protect, getCustomerProfile);

module.exports = router;
