package com.hatice.tarpets.api;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Data Access Object (DAO) for Product entities.
// Manages search, filtering, and listing operations on the 'products' table.
// Spring Data JPA analyzes method names to automatically generate the required SQL queries.
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. Filter by Main Category
    // Triggered when category buttons (e.g., Cat, Dog) are clicked in the Frontend.
    List<Product> findByCategory(String category);

    // 2. Filter by Subcategory
    // Retrieves specific groups like "Dry Food", "Toys", etc.
    List<Product> findBySubcategory(String subcategory);

    // 3. Filter Hot Deals (Discounted Products)
    // Lists products where 'isDiscounted' is true. Used for the main page showcase.
    List<Product> findByIsDiscountedTrue();

    // 4. Search Functionality
    // Finds products where the name contains the search keyword.
    // IgnoreCase: Case-insensitive matching (e.g., "Whiskas" matches "whiskas").
    List<Product> findByNameContainingIgnoreCase(String name);
}