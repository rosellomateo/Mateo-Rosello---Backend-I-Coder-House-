const express = require("express")
const CartManager = require("../services/CartManager")
const ProductManager = require("../services/ProductManager")
const error500  = require("../utils")
const mongoose = require('mongoose')
const CartRouter = express.Router()

CartRouter.post("/",async(req,res)=>{
    try {
        let cart = await CartManager.newCart()
        let cartId = cart.id
        
        res.setHeader('Content-type','application/json')
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
        res.status(200).json({status: "success", cartId: cart._id,products: cart.products})
    } catch (error) {
        error500(res,error)
    }
})

CartRouter.post("/:cid/products/:pid",async(req,res)=>{
    try{
        let cartId = req.params.cid
        let cartDb = await CartManager.getCartById(cartId)
        
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }

        let productId = req.params.pid
        console.log(productId)
        
        let productDb = await ProductManager.getProductById(productId)

        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"product not exist"})
        }

        await CartManager.addProduct(cartId,productId)
        return res.status(201).json({status:"sucess",message:"product add"})
    }catch(error){
        error500(res,error)
    }
})

CartRouter.put("/:cid",async (req,res)=>{
    try {
        let idCart = req.params.cid

        let cartDb = await CartManager.getCartById(idCart)
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }

        let products = req.body.products
        console.log(products)
        if(!Array.isArray(products)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"is not array of products"})
        }

        for (let i in products) {
            let productDb = await ProductManager.getProductById(products[i].product)
            if(!productDb){
                res.setHeader('Content-Type', 'application/json')
                return res.status(404).json({error:`Product ${products[i].product} not exist`})
            }
        }
        
        let result = await CartManager.updateCart(idCart,products)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({status:'sucess',message:`Cart ${idCart} Update`,result})
    } catch (error) {
        error500(res,error)
    }
})
CartRouter.put("/:cid/products/:pid",async (req,res)=>{
    try {
        let idCart = req.params.cid
        let idProduct = req.params.pid
        
        let cartDb = await CartManager.getCartById(idCart)
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }
        
        let productDb = await ProductManager.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }

        let productCart = cartDb.products.find(p=>p.product.code === productDb.code)
        if(!productCart){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not in cart'})
        }
        
        let quantity = req.body.quantity
        quantity = Number(quantity)

        if(isNaN(quantity)){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'quantity is not a number'})
        }

        let result = await CartManager.updateQuantity(idCart,idProduct,quantity)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({status:'success',message:`Cart ${idCart} Update`,result})
    } catch (error) {
        error500(res,error)
    }
})

CartRouter.delete("/:cid/products/:pid",async (req,res)=>{
    try{
        let idCart    = req.params.cid
        let idProduct = req.params.pid

        let cartDb = await CartManager.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let productDb = await ProductManager.getProductById(idProduct)
        if(!productDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not exist'})
        }
        let productCart = cartDb.products.find(p=>p.product.code === productDb.code)
        if(!productCart){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'product not in cart'})
        }
        let result = await CartManager.deleteProduct(idCart,idProduct)
        
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ status: 'success', message: 'Product removed from cart', result })
    }catch(error){
        error500(res,error)
    }
        
})

CartRouter.delete("/:cid",async(req,res)=>{
    try {
        let idCart = req.params.cid
    
        let cartDb = await CartManager.getCartById(idCart)
        if (!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).send({status:'error', message:'cart not exist'})
        }

        let result = await CartManager.clearCart(idCart)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).send({ status: 'success', message: 'cart empty: ', result })
    } catch (error) {
        error500(res,error)
    }
})

module.exports = CartRouter