package org.yearup.data;

import org.yearup.models.OrderLineItem;

import java.util.List;

public interface OrderLineItemDao
{
    void create(OrderLineItem item);
    List<OrderLineItem> getByOrderId(int orderId);
}
