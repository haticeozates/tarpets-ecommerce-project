package com.hatice.tarpets.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Order Entity Class.
// Represents order records in the database.
// Explicitly named "orders" because "ORDER" is a reserved keyword in SQL.
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;

    // Timestamp when the order was created
    private LocalDateTime createdAt;

    // Relationship: Many-to-One
    // An order belongs to a single user.
    // JsonIgnoreProperties: Prevents infinite recursion (User -> Order -> User).
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"orders"})
    private User user;

    // Relationship: One-to-Many
    // An order can contain multiple line items (OrderItem).
    // CascadeType.ALL: If the order is deleted, its items are also deleted.
    // FetchType.EAGER: Items are loaded immediately with the order (not Lazily).
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonIgnoreProperties({"order"}) // Infinite loop protection
    private List<OrderItem> items = new ArrayList<>();

    // ---- Constructors ----
    public Order() {}

    // ---- Getters & Setters ----
    public Long getId() {
        return id;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}