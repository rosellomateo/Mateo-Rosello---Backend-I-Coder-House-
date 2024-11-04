const express = require("express")
const handlebars = require("express-handlebars")
const {Server} = require("socket.io") 
const ProductRouter = require("./routers/ProductRouter")
const CartRouter = require("./routers/CartRouter")
const ViewsRouter = require("./routers/ViewsRouter")
const PORT = 8080


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("./src/public"))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const server = app.listen(PORT,()=>{console.log("Server start")}) // Server HHTP
const io = new Server(server) //Server Websocket
app.use("/api/products",ProductRouter)
app.use("/api/carts",CartRouter)
app.use("/",(req, res, next) => {
    req.io = io;
    next();
},ViewsRouter)
