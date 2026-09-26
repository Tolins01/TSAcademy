const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current'],
    required: true,
    default: 'savings'
  },
  balance: {
    type: Number,
    required: true,
    default: 15000,
    min: 0
  },
  password: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'closed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
