const mongoose = require("mongoose")
const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: [{
        idProduct: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]}, 
    { timestamps: true });

module.exports = mongoose.model(cartCollection,cartSchema)