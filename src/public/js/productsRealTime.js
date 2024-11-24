const socket = io()
const submitButton = document.getElementById("submit-product")
const productsDiv = document.getElementById("products-div")

const renderProduct = (product) =>{
    const productDiv = document.createElement("div")
    console.log(product)
    productDiv.innerHTML = `
        <h3>${product.title}</h3>
        <p>Code: ${product.code}</p>
        <p>${product.description}</p>
        <p>Price:${product.price} </p>
        <p>Status: ${product.status ? "Available" : "Out of Stock"}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
    `
    productsDiv.appendChild(productDiv)
}

const resetFields = () => {
    document.getElementById("title").value = ''
    document.getElementById("description").value = ''
    document.getElementById("code").value = ''
    document.getElementById("price").value = ''
    document.getElementById("stock").value = ''
    document.getElementById("category").value = ''
    document.getElementById("status").checked = false
}


submitButton.addEventListener("click", () => {
        const title = document.getElementById("title").value
        const description = document.getElementById("description").value
        const code = document.getElementById("code").value
        const price = parseFloat(document.getElementById("price").value)
        const status = document.getElementById("status").checked
        const stock = parseInt(document.getElementById("stock").value)
        const category = document.getElementById("category").value
        
        if (
            !title || !description || !code || isNaN(price) || isNaN(stock) || !category ||
            title === '' || description === '' || code === '' || !price || stock === null || category === ''
        ) {
            Swal.fire({
                icon: "error",
                title: "Complete the fields"})
                resetFields()
            return
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        }

        socket.emit("newProduct", newProduct)
        
        socket.once("productExists", (message) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: message
            })
            resetFields()
        })
    
        socket.once("productAdded", (product) => {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Product added successfully."
            })
            renderProduct(product)
            resetFields()
        })
})
