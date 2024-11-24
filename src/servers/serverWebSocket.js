const { Server } = require("socket.io")
const ProductManager = require("../services/ProductManager")

webSocket = (server) => {
    let io = new Server(server)
    return io
}


module.exports = webSocket