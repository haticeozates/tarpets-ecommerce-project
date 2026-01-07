package com.hatice.tarpets.api;

import java.util.List;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;


 // Data Transfer Object (DTO) for Order Creation Request.
 // Maps the incoming JSON payload from the frontend to a Java object.
 // Decouples the API layer from the persistence layer (Entities) for security and flexibility.
public class CreateOrderRequest {

    // ID of the user placing the order
    @NotNull
    private Long userId;

    // Total cart amount calculated on the frontend
    @NotNull
    private Double totalPrice;

    // List of items in the cart (Product ID, Quantity, Price)
    @NotNull
    private List<Item> items;

    // ---------- GETTERS & SETTERS ----------

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

     // Inner class representing a Line Item.
     // Represents individual product details within the order (product reference, quantity).
     // Defined as static to allow instantiation without an enclosing class instance.
    public static class Item {

        @NotNull
        private Long productId;

        @Min(1)
        private Integer quantity;

        @NotNull
        private Double price;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
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
}