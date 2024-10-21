const fs = require('fs').promises

class CartManager{
    static #carts = []
    static #path  = ""

    static setPath(path=""){
        this.#path = path
    }

    static async addProduct(idCart,idProduct){
        await this.#checkFileExistsAndLoad()
        
        let cartDb = this.#carts.find(c=> c.id === idCart)
        let productDb = cartDb.products.find(p=> p.idProduct === idProduct)
        
        if(productDb){
            productDb.quantity++
        }else{
            let newProduct = {
                idProduct: idProduct,
                quantity: 1
            }
            cartDb.products.push(newProduct)
        }
      
        await this.#updateFile()
        console.log(`Product ${idProduct} save in the cart ${idCart}`)
    }
    static async newCart(){
        let id = 1
        await this.#checkFileExistsAndLoad()
        if(this.#carts.length != 0)
            id = Math.max(...this.#carts.map(c=>c.id)) + 1 

        let newCart = {
            id : id,
            products: []
        }

        this.#carts.push(newCart)
        console.log(this.#carts)
        await this.#updateFile()
        console.log(`Cart ${id} create`)
        return id
    }
    static async getCartById(idCart){
        await this.#checkFileExistsAndLoad()
        let cartDb = this.#carts.find(c=> c.id === idCart)
        return cartDb
    }

    static async #updateFile() {
        try {
            await fs.writeFile(this.#path, JSON.stringify(this.#carts, null, 2))
        } catch (error) {
            console.error(`Error updating file: ${error}`)
        }
    }

    static async #readFile() {
        try {
            let file = await fs.readFile(this.#path, { encoding: 'utf-8' })
            if (file) {
                this.#carts = JSON.parse(file)
            }
        } catch (error) {
            console.error(`Error reading file: ${error}`)
        }
    }

    static async #checkFileExistsAndLoad() {
        try {
            await fs.access(this.#path)
            await this.#readFile()
        } catch(error) {
            console.error(`File at path "${this.#path}" does not exist: ${error}`)
        }
    }
}

module.exports = CartManager