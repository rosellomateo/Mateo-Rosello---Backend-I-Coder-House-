const socket = io()
const productsDiv = document.getElementById('products-container')
const sortSelect = document.getElementById('sort-select')
const prevPageBtn = document.getElementById('prevPage')
const nextPageBtn = document.getElementById('nextPage')

let currentPage = 1
let sortOrder = 'asc'

const renderProduct = (product) => {
  const existingProduct = document.getElementById(`product-${product._id}`)
  if (existingProduct) return

  const productDiv = document.createElement("div")
  productDiv.setAttribute("id", `product-${product._id}`)
  productDiv.classList.add("product-card")

  productDiv.innerHTML = `
    <a href="/products/${product._id}" class="product-link">
      <h2>${product.title}</h2>
      <p>Description: ${product.description}</p>
      <p>Code: ${product.code}</p>
      <p>Price: $${product.price}</p>
      <p>Status: ${product.status ? "Available" : "Out of Stock"}</p>
      <p>Stock: ${product.stock}</p>
      <p>Category: ${product.category}</p>
    </a>
  `
  productsDiv.appendChild(productDiv)
}

const clearProducts = () => {
  const productCards = productsDiv.querySelectorAll(".product-card")
  productCards.forEach((card) => card.remove())
}

const showError = (message) => {
  clearProducts()
  const errorMessage = document.createElement("p")
  errorMessage.textContent = message
  productsDiv.appendChild(errorMessage)
}

const fetchProducts = async (sortOrder) => {
  const loadingMessage = document.createElement("p")
  loadingMessage.textContent = "Loading products..."
  productsDiv.appendChild(loadingMessage)

  try {
    const response = await fetch(`../api/products?sort=${sortOrder}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    const data = await response.json()

    clearProducts()
    if (loadingMessage) loadingMessage.remove()

    const products = data.payload || []
    products.forEach(renderProduct)
  } catch (error) {
    console.error("Error fetching products:", error)
    showError("Error loading products. Please try again later.")
  }
}

sortSelect.addEventListener("change", (event) => {
  const sortOrder = event.target.value
  fetchProducts(sortOrder)
})

socket.on("productAdded", (product) => {
  renderProduct(product)
})
