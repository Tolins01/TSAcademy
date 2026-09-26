const nibssClient = require('../Config/nibssClient');
const { getValidToken } = require('../utils/nibssAuth');

exports.generateToken = async (req, res) => {
  try {
    const token = await getValidToken();

    return res.status(200).json({
      message: 'Token retrieved successfully',
      token
    });
  } catch (error) {
    return res.status(error.response?.status || 502).json({
      message: 'Error generating NIBSS token',
      error: error.response?.data || error.message
    });
  }
};

/*
 * These are legacy sandbox helpers for /insertBvn and /insertNin.
 * They are deliberately kept separate from Customer onboarding.
 */
exports.insertBvn = async (req, res) => {
  try {
    const { bvn, firstName, lastName, dob, phone } = req.body;

    if (!bvn || !firstName || !lastName || !dob || !phone) {
      return res.status(400).json({
        message: 'bvn, firstName, lastName, dob and phone are required'
      });
    }

    const response = await nibssClient.post('/insertBvn', {
      bvn, firstName, lastName, dob, phone
    });

    return res.status(200).json({
      message: 'BVN request successful',
      data: response.data
    });
  } catch (error) {
    return res.status(error.response?.status || 502).json({
      message: 'NIBSS BVN request failed',
      error: error.response?.data || error.message
    });
  }
};

exports.insertNin = async (req, res) => {
  try {
    const { nin, firstName, lastName, dob } = req.body;

    if (!nin || !firstName || !lastName || !dob) {
      return res.status(400).json({
        message: 'nin, firstName, lastName and dob are required'
      });
    }

    const response = await nibssClient.post('/insertNin', {
      nin, firstName, lastName, dob
    });

    return res.status(200).json({
      message: 'NIN request successful',
      data: response.data
    });
  } catch (error) {
    return res.status(error.response?.status || 502).json({
      message: 'NIBSS NIN request failed',
      error: error.response?.data || error.message
    });
  }
};
