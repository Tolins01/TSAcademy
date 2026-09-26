const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../Models/Customer');

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        customerId: customer._id.toString(),
        email: customer.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        phone: customer.phone,
        kycType: customer.kycType,
        onboardingStatus: customer.onboardingStatus
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};
