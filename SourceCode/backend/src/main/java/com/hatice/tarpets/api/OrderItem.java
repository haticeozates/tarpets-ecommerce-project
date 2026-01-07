package com.hatice.tarpets.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

// Order Item Entity Class.
// Represents a single line item within an order.
// Manages the relationship between Order and Product tables and stores specific details (quantity, snapshot price).
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship: Many-to-One -> Link to Parent Order
    // An order item must belong to a specific order.
    // JsonIgnoreProperties: Prevents infinite recursion (Order -> Items -> Order) during JSON serialization.
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties({"items"})
    private Order order;

    // Relationship: Many-to-One -> Link to Product
    // References the specific product sold.
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Quantity purchased
    private Integer quantity;

    // Unit price at the time of order.
    // NOTE: The main Product price may change over time (e.g., discounts or inflation).
    // We store the snapshot here to preserve historical data consistency for past orders.
    private Double price;

    public OrderItem() {}

    // ---- GETTERS & SETTERS ----

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}