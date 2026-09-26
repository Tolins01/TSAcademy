const Account = require('../Models/Account');
const Transaction = require('../Models/Transaction');
const nibssClient = require('../Config/nibssClient');

const NAME_ENQUIRY_PATH =
  process.env.NIBSS_NAME_ENQUIRY_PATH || '/account/name-enquiry';

const INTRA_TRANSFER_PATH =
  process.env.NIBSS_INTRA_TRANSFER_PATH || '/transfer';


exports.nameEnquiry = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { bankCode } = req.query;

    if (!accountNumber) {
      return res.status(400).json({ message: 'accountNumber is required' });
    }

    const response = await nibssClient.post(NAME_ENQUIRY_PATH, {
      accountNumber,
      ...(bankCode ? { bankCode } : {})
    });

    return res.status(200).json({
      message: 'Name enquiry successful',
      data: response.data
    });
  } catch (error) {
    return res.status(error.response?.status || 502).json({
      message: 'Name enquiry failed',
      error: error.response?.data || error.message
    });
  }
};

async function performTransfer({
  senderAccount,
  recipientAccountNumber,
  recipientBankCode,
  recipientName,
  amount,
  narration,
  type
}) {

  const numericAmount = Number(amount);

  // Validate amount
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw {
      status: 400,
      message: 'Transfer amount must be greater than zero'
    };
  }

  // Validate sender account
  if (!senderAccount) {
    throw {
      status: 400,
      message: 'Sender account not found'
    };
  }

  // Check balance
  if (senderAccount.balance < numericAmount) {
    throw {
      status: 400,
      message: 'Insufficient balance'
    };
  }

  // Create transaction record
  const transaction = await Transaction.create({
    senderAccount: senderAccount._id,
    senderAccountNumber: senderAccount.accountNumber,
    recipientAccountNumber,
    recipientBankCode: recipientBankCode || null,
    recipientName: recipientName || null,
    type,
    amount: numericAmount,
    narration: narration || ''
  });

  const endpoint =
    type === 'intra'
      ? INTRA_TRANSFER_PATH
      : '/transfer';

  try {

    // Request sent to NIBSS
    const response = await nibssClient.post(endpoint, {
      from: senderAccount.accountNumber,
      to: recipientAccountNumber,

      ...(recipientBankCode
        ? { bankCode: recipientBankCode }
        : {}),
      type,
      amount: numericAmount,
      narration: narration || ''
    });

    // Deduct money only after successful NIBSS response
    senderAccount.balance -= numericAmount;

    await senderAccount.save();

    // Update transaction
    transaction.status = 'successful';

    transaction.nibssTransactionRef =
      response.data?.reference ||
      response.data?.transactionId ||
      response.data?.transactionReference ||
      null;

    await transaction.save();

    return {
      transaction,
      apiResponse: response.data
    };

  } catch (error) {

    // Mark transaction as failed
    transaction.status = 'failed';

    throw {
      status: error.response?.status >= 400 ? 502 : 500,
      message: 'Transfer failed at NIBSS',
      error: error.response?.data || error.message,
      transaction
    };
  }
}

exports.transfer = async (req, res) => {
  try {

    const {
      recipientAccountNumber,
      recipientName,
      recipientBankCode,
      amount,
      narration
    } = req.body;

    if (!recipientAccountNumber || amount === undefined) {
      return res.status(400).json({
        message: 'recipientAccountNumber and amount are required'
      });
    }

    const result = await performTransfer({
      senderAccount: req.account,
      recipientAccountNumber,
      recipientBankCode,
      recipientName,
      amount,
      narration,
      type:'inter'
    });

    return res.status(200).json({
      message: 'Inter-bank transfer successful',
      ...result
    });

  } catch (error) {

    return res.status(error.status || 500).json(error);
  }
};


exports.checkBalance = async (req, res) => {
  return res.status(200).json({
    accountNumber: req.account.accountNumber,
    balance: req.account.balance,
    status: req.account.status
  });
};

exports.checkTransactionStatus = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const account = await Account.findOne({
      _id: transaction.senderAccount,
      customer: req.user.customerId
    });

    if (!account) {
      return res.status(403).json({
        message: 'You do not have access to this transaction'
      });
    }

    return res.status(200).json({ transaction });
  } catch (error) {
    return res.status(500).json({
      message: 'Error checking transaction status',
      error: error.message
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const account = await Account.findOne({
      customer: req.user.customerId
    });

    if (!account) {
      return res.status(404).json({
        message: 'No account found for this customer'
      });
    }

    const transactions = await Transaction.find({
      senderAccount: account._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({ transactions });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching transaction history',
      error: error.message
    });
  }
};
