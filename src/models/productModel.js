const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")
const productCollection = "products"


const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String,unique: true,  required: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
}, { 
    timestamps: true,
})

productSchema.plugin(paginate)


module.exports = mongoose.model(productCollection,productSchema)