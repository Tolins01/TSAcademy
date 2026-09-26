const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({

name: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
},
feedback: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'pending'  
}})


const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank; //export the model to be used in other files