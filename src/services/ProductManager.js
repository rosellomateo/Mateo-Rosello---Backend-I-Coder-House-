const productModel = require('../models/productModel')

class ProductManager {
    static async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        try {
            let productDb = await productModel.findOne({title:title,code:code})
            console.log(productDb)
            if (productDb) {
                console.error(`Product ${title} with code: ${code} already exists.`)
                return
            }
            let newProduct = {
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category
            }
            
            if(thumbnails){
                newProduct.thumbnails = thumbnails
            }

            console.log(newProduct)
            
            console.log(`Product ${title} saved.`)
            return await productModel.create(newProduct)
        } catch (error) {
            console.error(`Error adding product: ${error}`)
        }
    }

    static async getProducts() {
        try {
            let productsDb = await productModel.paginate({},{lean:true,sort:{price:1}})
            if (productsDb) {
                return productsDb
            }else{
                return []
            }
        } catch (error) {
            console.error(`Error get product: ${error}`)
        }
    }

    static async getProductsFilter(query,limit,page,sort){
        try {
            let productsDb = await productModel.paginate(query,{lean:true,page,limit,sort:{price:sort}})
            console.log(productsDb)
            return productsDb || []
        } catch (error) {
            console.error(`Error get product: ${error}`)
        }
    }

    static async getProductById(id) {
        try {
            let productDb =  await productModel.findById(id).lean()
            if(productDb){
                productDb.price = productDb.price.toString()
                productDb.price = parseFloat(productDb.price)
            }
            

            return productDb
        } catch (error) {
            console.error(`error to get product by id : ${error}`)
        }
        
    }

    static async getProduct(title, code) {
        try {
            let productDb = await productModel.findOne({title:title,code:code}).lean()
            
            if(productDb){
                productDb.price = productDb.price.toString()
                productDb.price = parseFloat(productDb.price)
            }
            
            return productDb
        } catch (error) {
            console.error(error)
        }
        
    }

    static async updateProduct(id, title, description, code, price, status, stock, category, thumbnails) {
        try {
            let productDb = await productModel.findById(id).lean()

            if (!product) {
                console.error(`Product ${id} not found.`)
                return
            }

            if (title)
                productDb.title = title
            if (description)
                productDb.description = description
            if (code)
                productDb.code = code
            if (price)
                productDb.price = price
            if (status)
                productDb.status = status
            if (stock)
                productDb.stock = stock
            if (category)
                productDb.category = category
            if (thumbnails)
                productDb.thumbnails = thumbnails

            await productModel.updateOne({id:id},productDb)
            console.log(`Product ${id} updated.`)
        } catch (error) {
            console.error(`error to update product: ${error}`)
        }
        
        
    }

    static async deleteProduct(id) {
        try {
            let response = await productModel.deleteOne({_id:id})
            console.log(`Product ${id} deleted : ${response}`)
        } catch (error) {
            console.error(`error to delete product: ${error}`)
        }
        
    }
}

module.exports = ProductManager
