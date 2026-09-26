const mongoose = require('mongoose');
const { Schema } = mongoose;

const apiModelSchema = new Schema({
  apiKey: { type: String, required: true, unique: true },
  apiName: { type: String, required: true, unique: true }
});

const apiBVNModelSchema = new Schema({
  bvn: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true }
});

const apiNinModelSchema = new Schema({
  nin: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true }
});

const apiTokenCacheSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

exports.ApiModel = mongoose.model('ApiModel', apiModelSchema);
exports.ApiBVNModel = mongoose.model('ApiBVNModel', apiBVNModelSchema);
exports.ApiNINModel = mongoose.model('ApiNINModel', apiNinModelSchema);
exports.ApiTokenCache = mongoose.model('ApiTokenCache', apiTokenCacheSchema);
