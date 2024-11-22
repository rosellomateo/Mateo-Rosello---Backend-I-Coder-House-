const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")

class CartManager{
    static async addProduct(idCart,idProduct){
        let cartDb = await this.addProductgetCartById(idCart)
        let products = cartDb.products
        let productDb = products.find(p => p.idProduct === idProduct)
        
        if(productDb){
            productDb.quantity++
        }else{
            let newProduct = {
                idProduct: idProduct,
                quantity: 1
            }
            
            products.push(newProduct)
        }
        return await cartModel.updateOne({_id:idCart},{products: products})
    }

    static async newCart(){
        let newCart = {
            products: []
        }
        return await cartModel.create(newCart)
    }
    
    static async getCartById(idCart){
        return await cartModel.findById(idCart)
    }

}

module.exports = CartManager