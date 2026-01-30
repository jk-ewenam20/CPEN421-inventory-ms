const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    // item_id : {
    //     type: UUID,
    //     unique: true
    // },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    }
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;