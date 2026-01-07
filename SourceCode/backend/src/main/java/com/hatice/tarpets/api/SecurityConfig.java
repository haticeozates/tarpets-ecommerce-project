package com.hatice.tarpets.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // Defines the encryption algorithm used for password hashing (BCrypt).
    // Essential for storing passwords securely in the database.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configures the security filter chain.
    // For this project, we prioritize flexibility for the REST API and H2 Console access.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (Cross-Site Request Forgery) as we are using stateless JWT authentication.
                .csrf(csrf -> csrf.disable())

                // Allow frames to support the H2 Database Console interface.
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Endpoint Authorization Configuration
                .authorizeHttpRequests(authorize -> authorize
                        // Allow full access to H2 Console
                        .requestMatchers("/h2-console/**").permitAll()

                        // Public Endpoints (Auth, Payment, Home)
                        .requestMatchers("/api/register", "/api/login", "/api/create-checkout-session", "/").permitAll()

                        // For this demo/production build, we allow all other requests to pass through the filter.
                        // Specific role checks (ADMIN vs USER) are handled within the Controllers using JWTUtil.
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}