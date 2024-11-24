const socket = io()
const productsDiv = document.getElementById("products-container")
const renderProduct = (product) =>{
    const productDiv = document.createElement("div")
    console.log(product)
    productDiv.innerHTML = `
        <div class="product-card">
        <a href="/products/${product.id}" class="product-link">
        <h2>${product.title}</h3>
        <p>Description: ${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price:${product.price} </p>
        <p>Status: ${product.status ? "Available" : "Out of Stock"}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
        </a>
        </div>
    `
    productsDiv.appendChild(productDiv)
}
socket.once("productAdded", (product) => {
    renderProduct(product)
})