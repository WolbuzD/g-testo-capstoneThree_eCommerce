package org.yearup.data.mysql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.yearup.data.OrderDao;
import org.yearup.data.OrderLineItemDao;
import org.yearup.models.Order;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class MySqlOrderDao extends MySqlDaoBase implements OrderDao
{
    @Autowired
    private OrderLineItemDao orderLineItemDao;

    public MySqlOrderDao(DataSource dataSource)
    {
        super(dataSource);
    }

    @Override
    public Order create(Order order)
    {
        // Fixed SQL to match actual database schema
        String sql = "INSERT INTO orders (user_id, date, address, city, state, zip, shipping_amount) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection connection = getConnection())
        {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, order.getUserId());
            ps.setTimestamp(2, Timestamp.valueOf(order.getCreatedDate().atStartOfDay())); // date is datetime
            ps.setString(3, order.getAddress());
            ps.setString(4, order.getCity());
            ps.setString(5, order.getState());
            ps.setString(6, order.getZip());
            ps.setBigDecimal(7, java.math.BigDecimal.ZERO); // shipping_amount

            ps.executeUpdate();

            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next())
            {
                int id = keys.getInt(1);
                order.setOrderId(id);
            }

            return order;
        }
        catch (SQLException e)
        {
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Order> getOrdersByUserId(int userId)
    {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC";

        try (Connection connection = getConnection())
        {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next())
            {
                try {
                    Order order = new Order();
                    order.setOrderId(rs.getInt("order_id"));
                    order.setUserId(rs.getInt("user_id"));
                    order.setCreatedDate(rs.getTimestamp("date").toLocalDateTime().toLocalDate()); // date is datetime
                    order.setAddress(rs.getString("address"));
                    order.setCity(rs.getString("city"));
                    order.setState(rs.getString("state"));
                    order.setZip(rs.getString("zip"));

                    // Load order items safely
                    order.setItems(orderLineItemDao.getByOrderId(order.getOrderId()));

                    orders.add(order);
                } catch (Exception ex) {
                    System.err.println("Failed to load line items for orderId: " + rs.getInt("order_id") + ". Error: " + ex.getMessage());
                    ex.printStackTrace();
                }
            }
        }
        catch (SQLException e)
        {
            throw new RuntimeException("Failed to retrieve orders: " + e.getMessage(), e);
        }

        return orders;
    }
}