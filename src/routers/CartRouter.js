const express = require("express")
const CartManager = require("../models/CartManager")
const ProductManager = require("../models/ProductManager")
const error500  = require("../utils")

CartManager.setPath("./src/data/carts.json")
ProductManager.setPath("./src/data/products.json")

const CartRouter = express.Router()

CartRouter.post("/",async(req,res)=>{
    let idCart = await CartManager.newCart()
    res.setHeader('Content-type','application/json')
    res.status(201).json({status:"success",message:`Create Cart ${idCart}`})
})

CartRouter.get("/:cid",async(req,res)=>{
    try {
        const cartId = Number(req.params.cid)
        if (isNaN(cartId)) {
            res.setHeader('Content-type','application-json')
            return res.status(400).json({ status: "error", error: "cartId is NaN" })
        }
        const cart = await CartManager.getCartById(cartId)
        if (!cart) {
            res.setHeader('Content-type','application-json')
            return res.status(404).json({ status: "error", error: "Cart not found" })
        }
        res.status(200).json(cart.products)
    } catch (error) {
        error500(res,error)
    }
})

CartRouter.post("/:cid/product/:pid",async(req,res)=>{
    try{
        let cartId = Number(req.params.cid)
        let productId = Number(req.params.pid)
        if (isNaN(cartId)) {
            res.setHeader('Content-type','application-json')
            return res.status(400).json({ status: "error", error: "cartId is NaN" })
        }
        if (isNaN(productId)) {
            res.setHeader('Content-type','application-json')
            return res.status(400).json({ status: "error", error: "productId is NaN" })
        }
        await CartManager.addProduct(cartId,productId)
        return res.status(200).json({status:"sucess",mesmessage:"product add"})
    }catch(error){
        res.setHeader('Content-type','application-json')
        return res.status(500).json({status:"error",error:"error to delete product"})
    }
})

module.exports = CartRouter