let orderService;

class OrderService {

    checkout() {
        const url = `${config.baseUrl}/orders`;

        return axios.post(url, {})
            .then(response => {
                // Clear cart after successful order
                cartService.cart = { items: [], total: 0 };
                cartService.updateCartDisplay();

                // Show success message
                const data = {
                    message: `Order #${response.data.orderId} placed successfully! Thank you for your purchase.`
                };
                templateBuilder.append("message", data, "errors");

                return response.data;
            })
            .catch(error => {
                const data = {
                    error: "Checkout failed. Please try again."
                };
                templateBuilder.append("error", data, "errors");
                throw error;
            });
    }

    getUserOrders() {
        const url = `${config.baseUrl}/orders`;

        return axios.get(url)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                const data = {
                    error: "Failed to load order history."
                };
                templateBuilder.append("error", data, "errors");
                throw error;
            });
    }

    loadOrderHistoryPage() {
        if (!userService.isLoggedIn()) {
            showLoginForm();
            return;
        }

        this.getUserOrders()
            .then(orders => {
                // Process orders for display
                const processedOrders = orders.map(order => ({
                    ...order,
                    formattedDate: new Date(order.createdDate).toLocaleDateString(),
                    itemCount: order.items ? order.items.length : 0,
                    hasItems: order.items && order.items.length > 0
                }));

                const data = {
                    orders: processedOrders,
                    hasOrders: processedOrders.length > 0,
                    username: userService.getUserName()
                };

                templateBuilder.build('order-history', data, 'main');
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    orderService = new OrderService();
});