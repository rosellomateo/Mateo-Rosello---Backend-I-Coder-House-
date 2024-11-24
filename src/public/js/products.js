document.getElementById('add-to-cart-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const productId = document.querySelector('[name="productId"]').value
    const quantityValue = document.getElementById('quantity').value
    console.log(quantity)

    const data = {
        quantity: quantityValue
    }

    try {
        const response = await fetch(`../api/carts/674272d2251dc31ce00ab070/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const responseData = await response.json()  // Corrige aquí usando .json() en minúsculas
        if (responseData.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                text: 'El producto ha sido agregado correctamente.'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al agregar el producto al carrito.'
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en la solicitud',
            text: 'Hubo un error al procesar la solicitud.'
        })
        console.error(error)
    }
})