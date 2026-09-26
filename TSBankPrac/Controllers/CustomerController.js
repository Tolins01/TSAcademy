const bcrypt = require('bcrypt');
const Customer = require('../Models/Customer');
const Account = require('../Models/Account');
const nibssClient = require('../Config/nibssClient');

exports.onboardCustomer = async (req, res) => {
  try {
    const { kycType, kycID, dob, email, phone, password } = req.body;

    if (!kycType || !kycID || !dob || !email || !phone || !password) {
      return res.status(400).json({
        message: 'kycType, kycID, dob, email, phone and password are required'
      });
    }

    if (!['bvn', 'nin'].includes(kycType)) {
      return res.status(400).json({
        message: 'kycType must be either bvn or nin'
      });
    }

    if (Number.isNaN(Date.parse(dob))) {
      return res.status(400).json({ message: 'dob must be a valid date' });
    }

    const existingCustomer = await Customer.findOne({
      $or: [
        { email: email.toLowerCase() },
        { kycType, kycID }
      ]
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: 'Customer with the supplied email, phone or KYC already exists'
      });
    }

    // NIBSS /account/create expects exactly the KYC fields.
    const response = await nibssClient.post('/account/create', {
      kycType,
      kycID,
      dob
    });

    const hashPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      kycType,
      kycID,
      dob,
      email: email.toLowerCase(),
      phone,
      password: hashPassword,
      onboardingStatus: 'verified',
      accountNumber:response.data?.account.accountNumber,
      nibssCustomerRef:
        response.data?.reference ||
        response.data?.id ||
        response.data?.account._id ||
        null
    });

    return res.status(201).json({
      message: 'Customer verified and onboarded successfully',
      customer: {
        id: customer._id,
        kycType: customer.kycType,
        kycID: customer.kycID,
        dob: customer.dob,
        email: customer.email,
        phone: customer.phone,
        accountNumber: customer.accountNumber,
        onboardingStatus: customer.onboardingStatus,
        nibssCustomerRef: customer.nibssCustomerRef
      },
      nibss: response.data
    });
  } catch (error) {
    const status = error.response?.status;

    return res.status(status && status >= 400 && status < 500 ? status : 502).json({
      message: 'BVN/NIN verification failed',
      error: error.response?.data || error.message
    });
  }
};

exports.getCustomerProfile = async (req, res) => {
  try {
    const {customer_id} = req.params
    const customer = await Customer.findById(customer_id).select('-password');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const account = await Account.findOne({ customer: customer._id });

    return res.status(200).json({ customer, account });

  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving customer profile',
      error: error.message
    });
  }
};
