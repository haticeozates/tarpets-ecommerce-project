package com.hatice.tarpets.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        // Main entry point for the Spring Boot application.
        // Initializes the embedded Tomcat server and Spring Context.
        SpringApplication.run(ApiApplication.class, args);
    }

     // Global Cross-Origin Resource Sharing (CORS) Configuration.
     // Enables the React frontend (running on port 3000) to communicate with this backend.
     // Essential for development environments where frontend and backend run on different ports.

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to all API endpoints
                        .allowedOrigins("http://localhost:3000") // Allow requests from React App
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*"); // Allow all headers
            }
        };
    }
}