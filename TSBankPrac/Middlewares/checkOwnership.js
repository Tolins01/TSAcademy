const Account = require('../Models/Account');

const checkAccountOwnership = async (req, res, next) => {
  try {
    const customerId = req.user?.customerId;
    const accountId = req.params?.accountId;

    if (!customerId) {
      return res.status(401).json({
        message: 'Invalid authentication payload'
      });
    }

    if (!accountId) {
      return res.status(400).json({
        message: 'Account ID is required'
      });
    }

    const account = await Account.findOne({
      _id: accountId,
      customer: customerId
    });

    if (!account) {
      return res.status(404).json({
        message: 'Account not found or not owned by you'
      });
    }

    req.account = account;
    next();

  } catch (error) {
    return res.status(500).json({
      message: 'Error verifying account ownership',
      error: error.message
    });
  }
};

module.exports = checkAccountOwnership;