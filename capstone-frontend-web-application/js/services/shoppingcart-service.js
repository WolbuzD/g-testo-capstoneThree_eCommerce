let cartService;

class ShoppingCartService {

    cart = {
        items:[],
        total:0
    };

    addToCart(productId)
    {
        const url = `${config.baseUrl}/cart/products/${productId}`;

        axios.post(url, {})
            .then(response => {
                this.setCart(response.data)
                this.updateCartDisplay()
            })
            .catch(error => {
                const data = {
                    error: "Add to cart failed."
                };
                templateBuilder.append("error", data, "errors")
            })
    }

    setCart(data)
    {
        this.cart = {
            items: [],
            total: 0
        }

        this.cart.total = data.total;

        for (const [key, value] of Object.entries(data.items)) {
            this.cart.items.push(value);
        }
    }

    loadCart()
    {
        const url = `${config.baseUrl}/cart`;

        axios.get(url)
            .then(response => {
                this.setCart(response.data)
                this.updateCartDisplay()
            })
            .catch(error => {
                const data = {
                    error: "Load cart failed."
                };
                templateBuilder.append("error", data, "errors")
            })
    }

    loadCartPage()
    {
        const main = document.getElementById("main")
        main.innerHTML = "";

        let div = document.createElement("div");
        div.classList="filter-box";
        main.appendChild(div);

        const contentDiv = document.createElement("div")
        contentDiv.id = "content";
        contentDiv.classList.add("content-form");

        const cartHeader = document.createElement("div")
        cartHeader.classList.add("cart-header")

        const h1 = document.createElement("h1")
        h1.innerText = "Shopping Cart";
        cartHeader.appendChild(h1);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("cart-button-container");

        const clearButton = document.createElement("button");
        clearButton.classList.add("btn", "btn-danger", "me-2");
        clearButton.innerText = "Clear Cart";
        clearButton.addEventListener("click", () => this.clearCart());
        buttonContainer.appendChild(clearButton);

        // ✅ NEW: Add Checkout Button
        if (this.cart.items.length > 0) {
            const checkoutButton = document.createElement("button");
            checkoutButton.classList.add("btn", "btn-success", "btn-lg", "checkout-btn");
            checkoutButton.innerText = "Checkout";
            checkoutButton.addEventListener("click", checkout);
            buttonContainer.appendChild(checkoutButton);
        }

        cartHeader.appendChild(buttonContainer);
        contentDiv.appendChild(cartHeader);

        // ✅ NEW: Show total if items exist
        if (this.cart.items.length > 0) {
            const totalDiv = document.createElement("div");
            totalDiv.classList.add("cart-total");
            totalDiv.innerHTML = `<h3>Total: $${this.cart.total.toFixed(2)}</h3>`;
            contentDiv.appendChild(totalDiv);
        }

        main.appendChild(contentDiv);

        // ✅ NEW: Show empty cart message if no items
        if (this.cart.items.length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("empty-cart");
            emptyDiv.innerHTML = `
                <div class="text-center mt-5">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <button class="btn btn-primary" onclick="loadHome()">Continue Shopping</button>
                </div>
            `;
            contentDiv.appendChild(emptyDiv);
        } else {
            // Show cart items
            this.cart.items.forEach(item => {
                this.buildItem(item, contentDiv)
            });
        }
    }

    buildItem(item, parent)
    {
        let outerDiv = document.createElement("div");
        outerDiv.classList.add("cart-item");

        let div = document.createElement("div");
        outerDiv.appendChild(div);
        let h4 = document.createElement("h4")
        h4.innerText = item.product.name;
        div.appendChild(h4);

        let photoDiv = document.createElement("div");
        photoDiv.classList.add("photo")
        let img = document.createElement("img");
        img.src = `/images/products/${item.product.imageUrl}`
        img.addEventListener("click", () => {
            showImageDetailForm(item.product.name, img.src)
        })
        photoDiv.appendChild(img)
        let priceH4 = document.createElement("h4");
        priceH4.classList.add("price");
        priceH4.innerText = `$${item.product.price}`;
        photoDiv.appendChild(priceH4);
        outerDiv.appendChild(photoDiv);

        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerText = item.product.description;
        outerDiv.appendChild(descriptionDiv);

        let quantityDiv = document.createElement("div")
        quantityDiv.innerText = `Quantity: ${item.quantity}`;
        outerDiv.appendChild(quantityDiv)

        // ✅ NEW: Add line total
        let lineTotalDiv = document.createElement("div");
        lineTotalDiv.classList.add("line-total");
        const lineTotal = item.product.price * item.quantity;
        lineTotalDiv.innerHTML = `<strong>Line Total: $${lineTotal.toFixed(2)}</strong>`;
        outerDiv.appendChild(lineTotalDiv);

        parent.appendChild(outerDiv);
    }

    clearCart()
    {
        const url = `${config.baseUrl}/cart`;

        axios.delete(url)
             .then(response => {
                 this.cart = {
                     items: [],
                     total: 0
                 }

                 this.cart.total = response.data.total;

                 for (const [key, value] of Object.entries(response.data.items)) {
                     this.cart.items.push(value);
                 }

                 this.updateCartDisplay()
                 this.loadCartPage()
             })
             .catch(error => {
                 const data = {
                     error: "Empty cart failed."
                 };
                 templateBuilder.append("error", data, "errors")
             })
    }

    updateCartDisplay()
    {
        try {
            const itemCount = this.cart.items.length;
            const cartControl = document.getElementById("cart-items")

            if (cartControl) {
                cartControl.innerText = itemCount;
            }
        }
        catch (e) {
            // Silently handle if cart display element doesn't exist
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cartService = new ShoppingCartService();

    if(userService.isLoggedIn())
    {
        cartService.loadCart();
    }
});