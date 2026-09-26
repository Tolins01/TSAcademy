const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  kycType: {
    type: String,
    enum: ['bvn', 'nin'],
    required: true
  },
  kycID: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  accountNumber:{
       type: String,
       unique: true
  },
  onboardingStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  },
  nibssCustomerRef: {
    type: String,
    default: null
  }
}, { timestamps: true });

customerSchema.index({ kycType: 1, kycID: 1 }, { unique: true });

customerSchema.pre('validate', function () {
  if (!this.kycID) {
    throw new Error('Customer must have a KYC ID');
  }
});

module.exports = mongoose.model('Customer', customerSchema);
