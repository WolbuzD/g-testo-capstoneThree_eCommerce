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
        // Fixed SQL - match exact database schema (no unit_price column)
        String sql = "INSERT INTO order_line_items (order_id, product_id, sales_price, quantity, discount) VALUES (?, ?, ?, ?, ?)";

        try (Connection connection = getConnection())
        {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, item.getOrderId());
            ps.setInt(2, item.getProductId());
            ps.setBigDecimal(3, item.getSalesPrice()); // Use salesPrice for sales_price column
            ps.setInt(4, item.getQuantity());
            ps.setBigDecimal(5, java.math.BigDecimal.ZERO); // discount

            System.out.println("Inserting line item: " + item.getProductId() + " x" + item.getQuantity() + " for orderId=" + item.getOrderId());

            ps.executeUpdate();

            // Capture the generated primary key
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                item.setLineItemId(keys.getInt(1));
            }
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
                item.setLineItemId(rs.getInt("order_line_item_id"));
                item.setOrderId(rs.getInt("order_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setQuantity(rs.getInt("quantity"));
                item.setSalesPrice(rs.getBigDecimal("sales_price"));
                // Set unitPrice to same as salesPrice since unit_price column doesn't exist
                item.setUnitPrice(rs.getBigDecimal("sales_price"));

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