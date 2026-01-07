package com.hatice.tarpets.api;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Standard Spring Data JPA query method.
    // Automatically generates SQL based on the method name to find orders by User ID.
    // Matches the method call used in the OrderController.
    List<Order> findByUserId(Long userId);

    // Advanced query method for alternative use cases.
    // Retrieves orders for a specific user, automatically sorted by creation date (Newest first).
    // Useful for showing "Recent Orders" in the UI.
    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}