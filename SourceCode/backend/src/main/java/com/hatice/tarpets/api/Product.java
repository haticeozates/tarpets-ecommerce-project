package com.hatice.tarpets.api;

import jakarta.persistence.*;

// Product Entity Class.
// Represents items available for sale in the inventory.
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Extended length to accommodate detailed product descriptions
    @Column(length = 1000)
    private String description;

    private Double price;
    private Double oldPrice;

    // Flag to indicate if the product is currently on sale
    private Boolean isDiscounted;

    private String category;
    private String subcategory;

    // Support for long URLs (e.g., external image hosting links)
    @Column(length = 2000)
    private String imageUrl;

    private Integer stock;

    public Product() {}

    public Product(String name, String description, Double price, Double oldPrice, Boolean isDiscounted,
                   String category, String subcategory, String imageUrl, Integer stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.oldPrice = oldPrice;
        this.isDiscounted = isDiscounted;
        this.category = category;
        this.subcategory = subcategory;
        this.imageUrl = imageUrl;
        this.stock = stock;
    }

    // ---- GETTERS & SETTERS ----

    // Essential for update operations where the ID needs to be set manually before saving.
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    // Standard getter for Boolean field.
    // Ensures compatibility with JSON serialization frameworks (like Jackson) used by the Frontend.
    public Boolean getIsDiscounted() {
        return isDiscounted;
    }

    public void setIsDiscounted(Boolean discounted) {
        isDiscounted = discounted;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}