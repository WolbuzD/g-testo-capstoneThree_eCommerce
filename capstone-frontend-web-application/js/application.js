function showLoginForm()
{
    templateBuilder.build('login-form', {}, 'login');
}

function hideModalForm()
{
    templateBuilder.clear('login');
}

function login()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    userService.login(username, password);
    hideModalForm()
}

function showImageDetailForm(product, imageUrl)
{
    const imageDetail = {
        name: product,
        imageUrl: imageUrl
    };

    templateBuilder.build('image-detail',imageDetail,'login')
}

function loadHome()
{
    templateBuilder.build('home',{},'main')

    productService.search();
    categoryService.getAllCategories(loadCategories);
}

function editProfile()
{
    profileService.loadProfile();
}

function saveProfile()
{
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;

    const profile = {
        firstName,
        lastName,
        phone,
        email,
        address,
        city,
        state,
        zip
    };

    profileService.updateProfile(profile);
}

function showCart()
{
    cartService.loadCartPage();
}

function clearCart()
{
    cartService.clearCart();
    cartService.loadCartPage();
}

// ✅ NEW: Checkout function
function checkout()
{
    if (!userService.isLoggedIn()) {
        const data = { 
            error: "Please log in to checkout." 
        };
        templateBuilder.append("error", data, "errors");
        showLoginForm();
        return;
    }
    
    if (!cartService.cart.items || cartService.cart.items.length === 0) {
        const data = { 
            error: "Your cart is empty. Add some items before checkout." 
        };
        templateBuilder.append("error", data, "errors");
        return;
    }
    
    // Show loading state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
    }
    
    orderService.checkout()
        .then(order => {
            // Redirect to home after successful checkout
            setTimeout(() => {
                loadHome();
            }, 2000);
        })
        .catch(error => {
            // Re-enable button on error
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Checkout';
            }
        });
}

// ✅ NEW: Show order history
function showOrderHistory()
{
    if (!userService.isLoggedIn()) {
        showLoginForm();
        return;
    }
    
    orderService.loadOrderHistoryPage();
}

function setCategory(control)
{
    productService.addCategoryFilter(control.value);
    productService.search();

}

function setColor(control)
{
    productService.addColorFilter(control.value);
    productService.search();

}

function setMinPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("min-price-display")
    label.innerText = control.value;

    const value = control.value != 0 ? control.value : "";
    productService.addMinPriceFilter(value)
    productService.search();

}

function setMaxPrice(control)
{
    // const slider = document.getElementById("min-price");
    const label = document.getElementById("max-price-display")
    label.innerText = control.value;

    const value = control.value != 1500 ? control.value : "";
    productService.addMaxPriceFilter(value)
    productService.search();

}

function closeError(control)
{
    setTimeout(() => {
        control.click();
    },3000);
}

document.addEventListener('DOMContentLoaded', () => {

    loadHome();
});