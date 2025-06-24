package org.yearup.data.mysql;

import org.springframework.stereotype.Component;
import org.yearup.data.OrderLineItemDao;
import org.yearup.models.OrderLineItem;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Component
public class MySqlOrderLineItemDao extends MySqlDaoBase implements OrderLineItemDao
{
    public MySqlOrderLineItemDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public void create(OrderLineItem item)
    {
        String sql = "INSERT INTO order_line_items (order_id, product_id, quantity, unit_price, sales_price) VALUES (?, ?, ?, ?, ?)";

        try (Connection connection = getConnection())
        {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, item.getOrderId());
            ps.setInt(2, item.getProductId());
            ps.setInt(3, item.getQuantity());
            ps.setBigDecimal(4, item.getUnitPrice());
            ps.setBigDecimal(5, item.getSalesPrice()); // ✅ added

            System.out.println("Inserting line item: " + item.getProductId() + " x" + item.getQuantity() + " for orderId=" + item.getOrderId());

            ps.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<OrderLineItem> getByOrderId(int orderId)
    {
        List<OrderLineItem> items = new ArrayList<>();
        String sql = "SELECT * FROM order_line_items WHERE order_id = ?";

        try (Connection connection = getConnection())
        {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, orderId);

            ResultSet rs = ps.executeQuery();

            while (rs.next())
            {
                OrderLineItem item = new OrderLineItem();
                item.setLineItemId(rs.getInt("line_item_id"));
                item.setOrderId(rs.getInt("order_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setUnitPrice(rs.getBigDecimal("unit_price"));
                item.setSalesPrice(rs.getBigDecimal("sales_price")); // ✅ added

                items.add(item);
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException(e);
        }

        return items;
    }
}
