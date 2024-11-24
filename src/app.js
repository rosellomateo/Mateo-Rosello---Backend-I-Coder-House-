const express = require("express")
const handlebars = require("express-handlebars")
const {Server} = require("socket.io")
const ProductRouter = require("./routers/ProductRouter")
const CartRouter = require("./routers/CartRouter")
const ViewsRouter = require("./routers/ViewsRouter")
const mongoConection = require("./connections/mongoDb")
const config = require("./config/config")
const serverHTTP = require("./servers/serverHTTP")
const serverWebSocket =  require("./servers/serverWebSocket")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static("./src/public"))

app.engine("handlebars",handlebars.engine({helpers: {multiply:(a, b) => a * b,},}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

const server = serverHTTP(app,config.PORT) // Server HHTP
const websocket = serverWebSocket(server) //Server Websocket

mongoConection(config.dbUrl,config.dbName) //Connection to MongoDB Atlas

app.use("/api/products",ProductRouter)
app.use("/api/carts",CartRouter)
app.use("/",(req, res, next) => {   
    req.io = websocket;
    next();
},ViewsRouter)