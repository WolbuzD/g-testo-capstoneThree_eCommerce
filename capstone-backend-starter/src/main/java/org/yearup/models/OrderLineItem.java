package org.yearup.models;

import java.math.BigDecimal;

public class OrderLineItem {
    private int lineItemId;
    private int orderId;
    private int productId;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal salesPrice; // ✅ Add this

    public OrderLineItem() {}

    public OrderLineItem(int orderId, int productId, int quantity, BigDecimal unitPrice, BigDecimal salesPrice) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.salesPrice = salesPrice;
    }

    // Getters and Setters
    public int getLineItemId() { return lineItemId; }
    public void setLineItemId(int lineItemId) { this.lineItemId = lineItemId; }

    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getSalesPrice() { return salesPrice; }  // ✅ Add this
    public void setSalesPrice(BigDecimal salesPrice) { this.salesPrice = salesPrice; }  // ✅ Add this
}
