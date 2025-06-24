package org.yearup.data;

import org.yearup.models.Order;

import java.util.List;

public interface OrderDao
{
    Order create(Order order);
    List<Order> getOrdersByUserId(int userId);
}
