const express = require('express');

const router = express.Router();

const protect = require('../Middlewares/auth');
const checkAccountOwnership = require('../Middlewares/checkOwnership');

const {
  nameEnquiry,
  transfer,
  checkBalance,
  checkTransactionStatus,
  getTransactionHistory
} = require('../Controllers/TransactionController');

// Name enquiry
router.get(
  '/name-enquiry/:accountNumber',
  protect,
  nameEnquiry
);

// Bank transfer
router.post(
  '/accounts/:accountId/transfer',
  protect,
  checkAccountOwnership,
  transfer
);

// Account balance
router.get(
  '/accounts/balance/:accountId',
  protect,
  checkAccountOwnership,
  checkBalance
);

// Transaction status
router.get(
  '/status/:transactionId',
  protect,
  checkTransactionStatus
);

// Transaction history
router.get(
  '/history',
  protect,
  getTransactionHistory
);

module.exports = router;