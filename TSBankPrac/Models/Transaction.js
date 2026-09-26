const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  // Store raw values too, since inter-bank recipients won't have an Account doc in your own DB
  senderAccountNumber: {
    type: String,
    required: true
  },
  recipientAccountNumber: {
    type: String,
    required: true
  },
  recipientBankCode: {
    type: String,
    default: null // null/omitted for intra-bank transfers
  },
  recipientName: {
    type: String,
    default: null // populated from the name-enquiry step before transfer
  },
  type: {
    type: String,
    enum: ['intra', 'inter'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  narration: {
    type: String,
    default: ''
  },
  // NIBSS's own reference for this transaction — required for the transaction-status check endpoint
  nibssTransactionRef: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
