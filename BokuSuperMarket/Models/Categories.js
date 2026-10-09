const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    IsAvailable: {  
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
},
{timestamps: true} // Date created and updated at
);


//create model from schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category; //export the model to be used in other files