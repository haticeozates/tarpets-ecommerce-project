package com.hatice.tarpets.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// User Management Controller.
// Handles user profile retrieval and administrative listing operations.
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. List All Users (Admin Dashboard).
    // Endpoint used by AdminPanel.js in the frontend to manage registered users.
    @GetMapping("/admin/users")
    public List<User> getAllUsers(@RequestHeader(value = "Authorization", required = false) String auth) {
        validateAdminAccess(auth);
        return userRepository.findAll();
    }

    // 2. Retrieve Single User Profile.
    // Used for the Profile Page to display user details.
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
    }

    // Helper method to validate Admin Role from the JWT Token.
    // Centralizes security logic for this controller.
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