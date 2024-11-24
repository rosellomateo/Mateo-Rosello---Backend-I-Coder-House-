const express = require("express")
const ProductManager = require("../services/ProductManager")
const CartManager = require("../services/CartManager")
const error500  = require("../utils")

const VistasRouter = express.Router()
VistasRouter.get("/",(req,res)=>{
    res.redirect("/products")
})

VistasRouter.get("/products",async (req,res) =>{
    try {
        let productsDb = await ProductManager.getProducts()
        res.render("home",{products: productsDb})
    } catch (error) {
        error500(res,error)
    }
    
})
VistasRouter.get("/carts/:cid",async (req,res)=>{
    try {
        let cartId = req.params.cid
        let cartDb = await CartManager.getCartById(cartId)
        
        if(!cartDb){
            res.setHeader('Content-Type', 'application/json')
            return res.status(404).json({error:"cart not exist"})
        }

        res.render("cart",cartDb)

    } catch (error) {
        error500(res,error)
    }
})
VistasRouter.get("/products/:pid",async (req,res) =>{
    try {
        let productId = req.params.pid
        let productDb = await ProductManager.getProductById(productId)
        res.render("product",productDb)
    } catch (error) {
        error500(res,error)
    }
})


VistasRouter.get("/realtimeproducts",async (req,res)=>{
    try{
        let productsDb = await ProductManager.getProducts()
        res.render("realTimeProducts",{products: productsDb})
        
        let io = req.io
        io.on("connection", (socket) => {
            console.log("webSocket on");
            console.log(`connect ${socket.id}`)
            
            socket.on("newProduct", async (product) => {
                console.log("new Product")
                let productDb = await ProductManager.getProduct(product.title, product.code)
                
                if (productDb) {
                    console.log("existe el producto")
                    socket.emit("productExists", "The product exists in the database")
                } else {
                    await ProductManager.addProduct(
                        product.title,
                        product.description,
                        product.code,
                        product.price,
                        product.status,
                        product.stock,
                        product.category,
                        product.thumbnails
                    )
                    const productCreate = await ProductManager.getProduct(product.title, product.code)
                    io.emit("productAdded", productCreate)
                }
            })
        })
    }catch(error){
        error500(res,error)
    }
    
})

module.exports = VistasRouter