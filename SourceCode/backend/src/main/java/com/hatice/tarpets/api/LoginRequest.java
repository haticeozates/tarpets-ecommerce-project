package com.hatice.tarpets.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Data Transfer Object (DTO) for User Login Request.
// Handles authentication requests (JSON) sent by the client (Frontend).
// Spring MVC automatically maps the JSON body to these fields (Data Binding).
public class LoginRequest {

    // User's email address (Key credential for login)
    @Email
    @NotBlank
    private String email;

    // User's password
    @NotBlank
    private String password;

    // ---------- GETTERS & SETTERS ----------

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}