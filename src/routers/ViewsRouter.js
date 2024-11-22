const express = require("express")
const ProductManager = require("../services/ProductManager")
const error500  = require("../utils")

const VistasRouter = express.Router()

VistasRouter.get("/",async (req,res) =>{
    let productsDb = await ProductManager.getProducts()
    console.log(productsDb)
    res.render("home",{products: productsDb})
})

VistasRouter.get("/realtimeproducts",async (req,res)=>{
    let productsDb = await ProductManager.getProducts()
    console.log(productsDb)
    res.render("realTimeProducts", { products: productsDb })
    io = req.io
    io.on("connection",socket=>{
        console.log("webSocket on")
        socket.emit("initialProducts", { products: productsDb })
        console.log(`connect ${socket.id}`)
        socket.on("newProduct", async product => {
            let newProduct = await ProductManager.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnails)
            io.emit("newProduct", newProduct);
        })
    })
})


module.exports = VistasRouter