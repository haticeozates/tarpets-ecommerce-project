package com.hatice.tarpets.api;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;


 // Utility class for handling JSON Web Tokens (JWT).
 //Responsible for generating, validating, and extracting information from tokens.
 // Central component for Stateless Authentication.
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final SecretKey key;
    private final long expirationMs;

    // Constructor Injection for security properties
    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expirationMs}") long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }


    // Generates a signed JWT for a specific user.
    // Includes User ID as subject and Role as a custom claim.
    public String generateToken(Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(userId.toString())
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }


     // Validates the authenticity and expiration of the provided JWT.,
     // Returns true only if the token signature is valid and not expired.
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.debug("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // Extracts the User ID (Subject) from the token claims.
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return Long.parseLong(claims.getSubject());
    }


    // Extracts the User Role from the token claims.
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return claims.get("role", String.class);
    }
}