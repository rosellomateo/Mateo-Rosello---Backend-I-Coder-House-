const cartModel = require("../models/cartModel")
const mongoose = require("mongoose")

class CartManager{
    static async addProduct(idCart,idProduct){
        try {
            const result = await cartModel.updateOne( {_id: idCart, "products.product": idProduct },{$inc: {"products.$.quantity": 1}})
            if (result.matchedCount === 0) {
                await cartModel.updateOne({_id: idCart },{$push: {products: { product: idProduct,quantity: 1}}})
            }
            return result
        } catch (error) {
            console.error(`Error adding product to cart: ${error.message}`)
        }
    }

    static async newCart(){
        try {
            let newCart = {}
            return await cartModel.create(newCart)
        } catch (error) {
            console.error(`error to create Cart: ${error}`)
        }
        
    }
    
    static async getCartById(idCart){
        try{
            return await cartModel.findById(idCart).populate('products.product').lean()
        }catch(error){
            console.error(`error to get Cart: ${error}`)
        }
        
    }

    static async updateCart(idCart,products){
        try {
            return await cartModel.updateOne({_id:idCart},{products: products})
        } catch (error) {
            console.error(`error to update products: ${error}`)
        }
    }

    static async updateQuantity(idCart,idProduct,quantity){
        try {
            let result = await cartModel.findOne({_id:idCart,"products.product": idProduct})
            if(result){
                return await cartModel.updateOne({_id:idCart,"products.product": idProduct},{$set: {"products.$.quantity":quantity}})
            }else{
                return await cartModel.updateOne({_id:idCart},{$push:{products:{product:idProduct,quantity:quantity}}})
            }
        } catch (error) {
            console.error(`error to update products: ${error}`)
        }
    }
    static async getProduct(idCart,code){
        try{
            return await cartModel.findOne({ _id: idCart, "products.product.code": code }).populate('products.product') 
        }catch(error){
            console.error(`error to get product: ${error}`)
        }
    }
    static async deleteProduct(idCart,idProduct){
        try{
            return await cartModel.updateOne({_id: idCart},{$pull: {products:{product:new mongoose.Types.ObjectId(idProduct)}}})
        }catch(error){
            console.error(`error to delete product: ${error}`)
        }
    }

    static async clearCart(idCart){
        try{
            return await cartModel.updateOne({_id:idCart},{products:[]})
        }catch(error){
            console.error(`error to delete product: ${error}`)
        }
        
    }
}

module.exports = CartManager