const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    Fullname: { 
        type: String,
        required: true 
        },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    matriculationNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
}, { timestamps: true });



const User = mongoose.model('User', userSchema);

module.exports = User;