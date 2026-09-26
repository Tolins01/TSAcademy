const Bank = require('../Models/Createbank');
const nibssClient = require('../Config/nibssClient');

exports.createBank = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'name and email are required'
      });
    }

    const existing = await Bank.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({
        message: 'Bank with this email already exists',
        bank: existing
      });
    }

    const bank = await Bank.create({
      name,
      email: email.toLowerCase(),
      feedback: 'pending'
    });

    try {
      // Kept configurable because the exact Phoenix Swagger path may differ.
      const path = process.env.NIBSS_FINTECH_ONBOARD_PATH || '/fintech/onboard';

      const response = await nibssClient.post(path, { name, email });

      bank.feedback = 'success';
      await bank.save();

      return res.status(201).json({
        message: 'Bank created successfully',
        data: response.data,
        bank
      });
    } catch (apiError) {
      bank.feedback = 'failed';
      await bank.save();

      return res.status(apiError.response?.status || 502).json({
        message: 'NIBSS bank onboarding failed',
        error: apiError.response?.data || apiError.message,
        bank
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Bank already exists',
        fields: error.keyValue
      });
    }

    return res.status(500).json({
      message: 'Error creating bank',
      error: error.message
    });
  }
};
