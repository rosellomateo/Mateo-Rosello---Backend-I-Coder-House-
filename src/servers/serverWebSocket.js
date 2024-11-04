const { Server } = require("socket.io")

const io = (server) =>{
    return new Server(server)
}


module.exports = io