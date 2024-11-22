const mongoose = require("mongoose")

const connectDb = async (url,dbName) =>{
    try {
        await mongoose.connect(
            url, 
            {
                dbName: dbName
            }
        )
        console.log(`DB online!`)
    } catch (error) {
            console.log(`Error: ${error.message}`)
    }
}

module.exports = connectDb