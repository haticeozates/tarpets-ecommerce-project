package com.hatice.tarpets.api;

import java.util.List;
import java.util.Map;


 // Data Transfer Object (DTO) for Authentication Response.
 // Carries the JWT token and user details to the client upon successful login/register.

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;

    // List of pets belonging to the user
    private List<Map<String, Object>> pets;

    // Statistics for the dashboard (e.g., "Cat": 2, "Dog": 1)
    private Map<String, Integer> petTypeCounts;

    // Total number of pets
    private Integer petCount;

    // --- Getters and Setters ---

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Map<String, Object>> getPets() {
        return pets;
    }

    public void setPets(List<Map<String, Object>> pets) {
        this.pets = pets;
    }

    public Map<String, Integer> getPetTypeCounts() {
        return petTypeCounts;
    }

    public void setPetTypeCounts(Map<String, Integer> petTypeCounts) {
        this.petTypeCounts = petTypeCounts;
    }

    public Integer getPetCount() {
        return petCount;
    }

    public void setPetCount(Integer petCount) {
        this.petCount = petCount;
    }
}