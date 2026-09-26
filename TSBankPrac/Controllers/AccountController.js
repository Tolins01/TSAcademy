const Customer = require('../Models/Customer');
const Account = require('../Models/Account');

const PRE_FUND_AMOUNT = 15000;

exports.createAccount = async (req, res) => {
  try {
    const { accountType , email} = req.body;

    if (accountType && !['savings', 'current'].includes(accountType)) {
      return res.status(400).json({
        message: 'accountType must be savings or current'
      });
    }

    const customer = await Customer.findOne({ email:email });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.onboardingStatus !== 'verified') {
      return res.status(403).json({
        message: 'Customer must be verified before creating an account'
      });
    }

    const existingAccount = await Account.findOne({ email: email });

    if (existingAccount) {
      return res.status(409).json({
        message: 'Customer already has an account',
        account: existingAccount
      });
    }

    

    const account = await Account.create({
      customer: customer._id,
      accountType: accountType || 'savings',
      balance: customer.balance || PRE_FUND_AMOUNT,
      password: customer.password,
      accountNumber: customer.accountNumber, 
      email: customer.email,
      phone: customer.phone
    });

    return res.status(201).json({
      message: 'Account created and pre-funded successfully',
      account
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with one of these unique fields already exists',
        fields: error.keyValue
      });
    }

    return res.status(500).json({
      message: 'Error creating account',
      error: error.message
    });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      customer: req.user.customerId
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.status(200).json({ account, customer });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching account',
      error: error.message
    });
  }
};
