const express = require("express")
const CartManager = require("../services/CartManager")
const ProductManager = require("../services/ProductManager")
const error500  = require("../utils")

const CartRouter = express.Router()

CartRouter.post("/",async(req,res)=>{
    try {
        console.log("cart")
        let cart = await CartManager.newCart()
        let cartId = cart.id
        console.log("ya tiene id")
        res.setHeader('Content-type','application/json')
        console.log(cart.id)
        return res.status(201).json({status:"success",message:`Create Cart ${cartId}`})
    } catch (error) {
        error500(res,error)
    }
})

CartRouter.get("/:cid",async(req,res)=>{
    try {
        const cartId = req.params.cid
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

CartRouter.post("/:cid/products/:pid",async(req,res)=>{
    try{
        let cartId = req.params.cid
        let cartDb = await CartManager.getCartById(cartId)
        
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({error:"cart not exist"})
        }

        let productId = req.params.pid
        console.log(productId)
        
        let productDb = await ProductManager.getProductById(productId)
        console.log(productDb)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({error:"product not exist"})
        }

        await CartManager.addProduct(cartId,productId)
        return res.status(200).json({status:"sucess",message:"product add"})
    }catch(error){
        error500(res,error)
    }
})

CartRouter.delete("/:cid/products/:pid",async (req,res)=>{
    try{
        let idCart    = req.params.cid
        let idProduct = req.params.pid

        let cartDb = CartManager.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let productDb = ProductManager.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }
        cartDb.products.find(p=> p.idProduct === idProduct)
    }catch(error){
        error500(res,error)
    }
        
})

CartRouter.delete("/:cid",async(req,res)=>{
    try {
        let idCart = req.params.cid
    
        let cartDb = CartManager.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let productDb = ProductManager.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }
        

    } catch (error) {
        error500(res,error)
    }
})

module.exports = CartRouter