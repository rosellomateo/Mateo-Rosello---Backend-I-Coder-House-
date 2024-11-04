const express = require("express")
const ProductManager = require("../models/ProductManager")
const error500  = require("../utils")

ProductManager.setPath("./src/data/products.json")

const ProductRouter = express.Router()

ProductRouter.get("/",async (req,res)=>{
    try{
        let products = await ProductManager.getProducts()
        return res.status(200).send(products)
    }catch(error){
        console.error(`error: ${error}`)
        res.setHeader('Content-type','application/json')
        return res.status(500).json({status:"error", error:"error get products"})
    }
    
})

ProductRouter.get("/:pid",async (req,res)=>{
    res.setHeader('Content-type','application/json')
    
    let productId = req.params.pid
    
    productId = Number(productId)
    
    if(isNaN(productId)){
        return res.status(400).json({status:"error",error:"Incorrect data type"})
    }

    try {
        let productDb = await ProductManager.getProductById(productId)
        if(!productDb){
            return res.status(404).send({status:"error",error:"product not found"})
        }
        return res.status(200).send(productDb)
    } catch (error) {
        error500(res,error)
    }
    
})

ProductRouter.post("/",async (req,res)=>{
    let { title, description, code, price, status, stock, category, thumbnails} = req.body
    price = Number(price)
    stock = Number(stock)
    if(isNaN(price)){
        res.setHeader('Content-type','application/json')
        return res.status(400).json({status:"error",error:"Price is not a number"})
    }
    if(isNaN(stock)){
        res.setHeader('Content-type','application/json')
        return res.status(400).json({status:"error",error:"stock is not a number"})
    }

    if (isNaN(price)) {
        return res.status(400).json({ status: "error", error: "Price must be a valid number" })
    }
    
    if (isNaN(stock)) {
        return res.status(400).json({ status: "error", error: "Stock must be a valid number" })
    }
    
    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ status: "error", error: "Title must be a non-empty string" })
    }
    
    if (typeof description !== "string" || description.trim() === "") {
        return res.status(400).json({ status: "error", error: "Description must be a non-empty string" })
    }
    
    if (typeof code !== "string" || code.trim() === "") {
        return res.status(400).json({ status: "error", error: "Code must be a non-empty string" })
    }
    
    if (typeof status !== "boolean") {
        return res.status(400).json({ status: "error", error: "Status must be a boolean" })
    }
    
    if (typeof stock !== "number" || stock < 0) {
        return res.status(400).json({ status: "error", error: "Stock must be a non-negative number" })
    }
    
    if (typeof category !== "string" || category.trim() === "") {
        return res.status(400).json({ status: "error", error: "Category must be a non-empty string" })
    }
    
    if (thumbnails &&(!Array.isArray(thumbnails) || thumbnails.length === 0 || !thumbnails.every(item => typeof item === 'string'))) {
        return res.status(400).json({ status: "error", error: "Thumbnails must be a non-empty array of strings" })
    }
    
    if (!title || !description || !code || price <= 0 || stock < 0 || !category) {
        return res.status(400).json({ status: "error", error: "All fields are required and must be valid" })
    }
    
    try{
        let productDb = await ProductManager.getProduct(title,code)
        if(productDb){
            res.setHeader('Content-type','application/json')
            return res.status(400).send({status:"error",message:"Product exits"})
        }
        ProductManager.addProduct(title, description, code, price, status, stock, category, thumbnails)
        res.setHeader('Content-type','application/json')
        return res.status(201).send({status:"success",message:"product create"})
    }catch(error){
        error500(res,error)
    }
    
})

ProductRouter.put("/:pid", async (req,res)=>{
    let { title, description, code, price, status, stock, category, thumbnails } = req.body
    let productId = req.params.pid

    productId = Number(productId)
    if(isNaN(productId)){
        res.setHeader('Content-type','application/json')
        return res.status(400).json({status:"error",error:"Incorrect data type"})
    }
    
    try{
        let productDb = await ProductManager.getProductById(productId)
        console.log(`productoDb: ${productDb}`)
        if(!productDb){
            res.setHeader('Content-type','application/json')
            res.status(404).json({status:"error",error:"product not exist"})
        }
        await ProductManager.updateProduct(productId,title,description,code,price,status,stock,category,thumbnails)
        
        res.setHeader('Content-type','application/json')
        return res.status(200).json({status:"success",message:"product update"})
    }catch(error){
        res.setHeader('Content-type','application/json')
        return res.status(500).json({status:"error",error:`error to delete product: ${error}`})
    }
})

ProductRouter.delete("/:pid", async (req,res)=>{
    let productId = req.params.pid
    
    productId = Number(productId)
    
    if(isNaN(productId)){
        res.setHeader('Content-type','application/json')
        return res.status(400).json({status:"error",error:"Incorrect data type"})
    }
    
    let productDb = await ProductManager.getProductById(productId)

    if(!productDb){
        res.setHeader('Content-type','application/json')
        return res.status(404).json({status:"error",error:"product not found"})
    }

    try{
        ProductManager.deleteProduct(productId)
        res.setHeader('Content-type','application/json')
        return res.status(200).json({status:"success",message:"product delete"})
    }catch (error){
        error500(res,error)
    }
})

module.exports = ProductRouter