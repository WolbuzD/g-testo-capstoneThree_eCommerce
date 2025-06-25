let cartService;

class ShoppingCartService {

    cart = {
        items:[],
        total:0
    };

    addToCart(productId)
    {
        // ✅ Check if user is logged in first
        if (!userService.isLoggedIn()) {
            const data = {
                error: "Please log in to add items to cart."
            };
            templateBuilder.append("error", data, "errors");
            showLoginForm();
            return;
        }

        const url = `${config.baseUrl}/cart/products/${productId}`;

        console.log('🛒 Adding to cart:', {
            productId,
            url,
            token: userService.currentUser.token ? 'Present' : 'Missing',
            userLoggedIn: userService.isLoggedIn()
        });

        return axios.post(url, {})
            .then(response => {
                console.log('✅ Add to cart success:', response.data);

                // Check if response.data exists before processing
                if (response.data) {
                    this.setCart(response.data);
                    this.updateCartDisplay();

                    // Show success message
                    const data = {
                        message: "Product added to cart successfully!"
                    };
                    templateBuilder.append("message", data, "errors");
                } else {
                    console.warn('⚠️ Empty response data from add to cart');
                    // Still try to reload the cart
                    this.loadCart();
                }

                return response.data;
            })
            .catch(error => {
                console.error('❌ Add to cart failed:', error);

                let errorMessage = "Add to cart failed.";

                if (error.response) {
                    // Server responded with error status
                    console.error('Server Error Details:', {
                        status: error.response.status,
                        data: error.response.data,
                        headers: error.response.headers
                    });

                    switch (error.response.status) {
                        case 401:
                            errorMessage = "Please log in to add items to cart.";
                            showLoginForm();
                            break;
                        case 404:
                            errorMessage = "Product not found.";
                            break;
                        case 500:
                            errorMessage = "Server error. Please try again later.";
                            break;
                        default:
                            errorMessage = error.response.data?.message || "Add to cart failed.";
                    }
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('Network Error - No Response:', error.request);
                    errorMessage = "Cannot connect to server. Please check if the backend is running.";
                } else {
                    // Something else happened
                    console.error('Request Setup Error:', error.message);
                    errorMessage = "Request failed: " + error.message;
                }

                const data = { error: errorMessage };
                templateBuilder.append("error", data, "errors");
                throw error;
            });
    }

    setCart(data)
    {
        // Initialize cart with defaults
        this.cart = {
            items: [],
            total: 0
        }

        // Safely set total
        this.cart.total = data?.total || 0;

        // Check if data.items exists and is not null/undefined
        if (data && data.items) {
            // Handle both array and object formats
            if (Array.isArray(data.items)) {
                // If items is already an array
                this.cart.items = data.items;
            } else {
                // If items is an object, convert to array
                for (const [key, value] of Object.entries(data.items)) {
                    this.cart.items.push(value);
                }
            }
        }

        console.log('✅ Cart set:', this.cart);
    }

    loadCart()
    {
        // Check if user is logged in
        if (!userService.isLoggedIn()) {
            console.log('ℹ️ User not logged in, skipping cart load');
            return Promise.resolve();
        }

        const url = `${config.baseUrl}/cart`;

        return axios.get(url)
            .then(response => {
                console.log('✅ Cart loaded:', response.data);
                this.setCart(response.data);
                this.updateCartDisplay();
                return response.data;
            })
            .catch(error => {
                console.error('❌ Cart load failed:', error);

                // Don't show error for unauthorized cart loads
                if (error.response && error.response.status !== 401) {
                    const data = {
                        error: "Failed to load cart."
                    };
                    templateBuilder.append("error", data, "errors");
                }
                throw error;
            });
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

        // Add Checkout Button
        if (this.cart.items.length > 0) {
            const checkoutButton = document.createElement("button");
            checkoutButton.classList.add("btn", "btn-success", "btn-lg", "checkout-btn");
            checkoutButton.innerText = "Checkout";
            checkoutButton.addEventListener("click", checkout);
            buttonContainer.appendChild(checkoutButton);
        }

        cartHeader.appendChild(buttonContainer);
        contentDiv.appendChild(cartHeader);

        // Show total if items exist
        if (this.cart.items.length > 0) {
            const totalDiv = document.createElement("div");
            totalDiv.classList.add("cart-total");
            totalDiv.innerHTML = `<h3>Total: $${this.cart.total.toFixed(2)}</h3>`;
            contentDiv.appendChild(totalDiv);
        }

        main.appendChild(contentDiv);

        // Show empty cart message if no items
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

        // Add line total
        let lineTotalDiv = document.createElement("div");
        lineTotalDiv.classList.add("line-total");
        const lineTotal = item.product.price * item.quantity;
        lineTotalDiv.innerHTML = `<strong>Line Total: $${lineTotal.toFixed(2)}</strong>`;
        outerDiv.appendChild(lineTotalDiv);

        parent.appendChild(outerDiv);
    }

    clearCart()
    {
        if (!userService.isLoggedIn()) {
            const data = {
                error: "Please log in to clear cart."
            };
            templateBuilder.append("error", data, "errors");
            return Promise.reject(new Error("User not logged in"));
        }

        const url = `${config.baseUrl}/cart`;

        return axios.delete(url)
             .then(response => {
                 console.log('✅ Cart cleared:', response.data);

                 // Reset cart to empty state
                 this.cart = {
                     items: [],
                     total: 0
                 }

                 // Set cart data from response if available
                 if (response.data) {
                     this.setCart(response.data);
                 }

                 this.updateCartDisplay()
                 this.loadCartPage()

                 const data = {
                     message: "Cart cleared successfully!"
                 };
                 templateBuilder.append("message", data, "errors");

                 return response.data;
             })
             .catch(error => {
                 console.error('❌ Clear cart failed:', error);
                 const data = {
                     error: "Failed to clear cart."
                 };
                 templateBuilder.append("error", data, "errors");
                 throw error;
             });
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
            console.log('ℹ️ Cart display element not found (this is normal during page load)');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cartService = new ShoppingCartService();

    // Only load cart if user is logged in
    if(userService && userService.isLoggedIn())
    {
        cartService.loadCart();
    }
});