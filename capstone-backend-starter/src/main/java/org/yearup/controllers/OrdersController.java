package org.yearup.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.yearup.data.OrderDao;
import org.yearup.data.OrderLineItemDao;
import org.yearup.data.ShoppingCartDao;
import org.yearup.data.UserDao;
import org.yearup.models.Order;
import org.yearup.models.OrderLineItem;
import org.yearup.models.ShoppingCart;
import org.yearup.models.ShoppingCartItem;
import org.yearup.models.User;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class OrdersController
{
    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderLineItemDao orderLineItemDao;

    @Autowired
    private ShoppingCartDao shoppingCartDao;

    @Autowired
    private UserDao userDao;

    @PostMapping
    @Transactional
    public Order placeOrder(@RequestBody(required = false) Object unused,
                            java.security.Principal principal)
    {
        try
        {
            String userName = principal.getName();
            User user = userDao.getByUserName(userName);
            int userId = user.getId();

            ShoppingCart cart = shoppingCartDao.getByUserId(userId);
            if (cart == null || cart.getItems().isEmpty())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty.");

            BigDecimal total = cart.getItems().values().stream()
                    .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Order order = new Order(userId, LocalDate.now(), total);
            order.setAddress("123 Main St");
            order.setCity("New York");
            order.setState("NY");
            order.setZip("10001");

            order = orderDao.create(order);

            for (ShoppingCartItem item : cart.getItems().values())
            {
                BigDecimal unitPrice = item.getProduct().getPrice();
                BigDecimal salesPricePerUnit = unitPrice; // adjust if discount logic is added

                OrderLineItem line = new OrderLineItem(
                        order.getOrderId(),
                        item.getProductId(),
                        item.getQuantity(),
                        unitPrice,
                        salesPricePerUnit
                );

                orderLineItemDao.create(line);
            }

            return order;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Checkout failed: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Order> getUserOrders(java.security.Principal principal)
    {
        try
        {
            String userName = principal.getName();
            User user = userDao.getByUserName(userName);
            return orderDao.getOrdersByUserId(user.getId());
        }
        catch (Exception e)
        {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not fetch orders.");
        }
    }
}
