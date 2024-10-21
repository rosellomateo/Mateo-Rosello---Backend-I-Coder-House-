const express = require("express")
const ProductRouter = require("./routers/ProductRouter")
const CartRouter = require("./routers/CartRouter")

const PORT = 8080

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/products",ProductRouter)
app.use("/api/carts",CartRouter)

const server = app.listen(PORT,()=>{
    console.log("Server start")
})
