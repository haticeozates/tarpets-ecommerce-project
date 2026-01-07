package com.hatice.tarpets.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

// Product Controller (REST API).
// Manages the product catalog. Handles public browsing (search/filter) and protected administrative actions.
@RestController
@RequestMapping("/api/products") // Base URL set to /api/products for frontend consistency.
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. Main Search and Listing Endpoint.
    // Supports dynamic filtering by 'category' or 'search' keyword via Query Parameters.
    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        if (category != null && !category.isEmpty()) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findAll();
    }

    // 2. Retrieve Products by Category.
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category);
    }

    // 3. Retrieve Discounted Products (e.g. for Home Page slider).
    @GetMapping("/discounted")
    public List<Product> getDiscountedProducts() {
        return productRepository.findByIsDiscountedTrue();
    }

    // 4. Get Single Product Details by ID.
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    // 5. Create New Product (Admin Access Required).
    @PostMapping
    public Product createProduct(@RequestHeader(value = "Authorization", required = false) String auth, @RequestBody Product product) {
        validateAdminAccess(auth);
        return productRepository.save(product);
    }

    // 6. Update Existing Product (Admin Access Required).
    @PutMapping("/{id}")
    public Product updateProduct(@RequestHeader(value = "Authorization", required = false) String auth, @PathVariable Long id, @RequestBody Product updatedProduct) {
        validateAdminAccess(auth);

        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setDescription(updatedProduct.getDescription());
                    product.setPrice(updatedProduct.getPrice());
                    product.setOldPrice(updatedProduct.getOldPrice());
                    product.setIsDiscounted(updatedProduct.getIsDiscounted());
                    product.setCategory(updatedProduct.getCategory());
                    product.setSubcategory(updatedProduct.getSubcategory());
                    product.setImageUrl(updatedProduct.getImageUrl());
                    product.setStock(updatedProduct.getStock());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    // 7. Delete Product (Admin Access Required).
    @DeleteMapping("/{id}")
    public String deleteProduct(@RequestHeader(value = "Authorization", required = false) String auth, @PathVariable Long id) {
        validateAdminAccess(auth);

        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return "Deleted product with id: " + id;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
    }

    // Helper method to validate Admin Role from the JWT Token.
    // Centralizes security logic to prevent code duplication (DRY Principle).
    private void validateAdminAccess(String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null || !jwtUtil.validateToken(token) || !"ADMIN".equals(jwtUtil.getRoleFromToken(token))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Admins only.");
        }
    }
}