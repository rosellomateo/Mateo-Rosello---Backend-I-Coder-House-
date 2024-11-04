const socket = io()
const submitButton = document.getElementById("submit-product");
const productsDiv = document.getElementById("products-div");

const renderProduct = (product) =>{
    const productDiv = document.createElement("div")
    productDiv.innerHTML = `
        <h3>${product.id}: ${product.title}</h3>
        <p>${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
        <p>Status: ${product.status ? "Available" : "Out of Stock"}</p>
        ${product.thumbnails && product.thumbnails.length ? `<img src="${product.thumbnails[0]}" alt="Product Image">` : ""}
        <hr>
    `
    productsDiv.appendChild(productDiv)
}


submitButton.addEventListener("click", () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const code = document.getElementById("code").value;
        const price = parseFloat(document.getElementById("price").value);
        const status = document.getElementById("status").checked;
        const stock = parseInt(document.getElementById("stock").value);
        const category = document.getElementById("category").value;

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
    
        Swal.fire("Success!", "Product added successfully.", "success")
        document.getElementById("product-form").reset()
})

socket.on("initialProducts", (products) => {
    products.forEach(renderProduct)
})

socket.on("newProduct", (product) => {
    renderProduct(product)
})
