package com.hatice.tarpets.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // --- REGISTER ENDPOINT ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Validation: Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        // Set default role
        user.setRole("USER");

        // Securely encode the password
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Initial save to generate the User ID (Required for foreign keys)
        User savedUser = userRepository.save(user);

        // Pet Logic: Parse comma-separated string from frontend (e.g., "Cat, Dog")
        if (user.getTempPetType() != null && !user.getTempPetType().isEmpty()) {
            String[] types = user.getTempPetType().split(",");
            List<Pet> petList = new ArrayList<>();

            for (String type : types) {
                Pet p = new Pet();
                p.setType(type.trim());
                p.setName("My " + type.trim()); // Default naming convention
                p.setUser(savedUser);
                petList.add(p);
            }
            // Update user with the new pet list and persist changes
            savedUser.setPets(petList);
            userRepository.save(savedUser);
        }

        // Generate response with Token and User Data
        return ResponseEntity.ok(buildAuthResponse(savedUser));
    }

    // --- LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Fetch user with pets to prevent LazyLoadingException
        User user = userRepository.findByEmailFetchPets(loginRequest.getEmail()).orElse(null);

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            // Credentials valid, return auth response
            return ResponseEntity.ok(buildAuthResponse(user));
        }

        // Invalid credentials
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    /**
     * Helper method to build the Authentication Response DTO.
     * Centralizes logic to avoid code duplication in Login and Register.
     */
    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(user.getId());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhoneNumber());
        response.setRole(user.getRole());

        // Map Pet entities to a simplified list structure
        List<Map<String, Object>> petDtos = new ArrayList<>();
        if (user.getPets() != null) {
            for (Pet p : user.getPets()) {
                Map<String, Object> pd = new HashMap<>();
                pd.put("id", p.getId());
                pd.put("name", p.getName());
                pd.put("type", p.getType());
                petDtos.add(pd);
            }
        }
        response.setPets(petDtos);

        // Calculate counts per pet type (e.g., "Cat": 2, "Dog": 1)
        Map<String, Integer> petTypeCounts = new HashMap<>();
        for (Map<String, Object> pd : petDtos) {
            String type = pd.get("type") == null ? "Unknown" : pd.get("type").toString();
            type = type.trim();
            if (type.isEmpty()) type = "Unknown";
            petTypeCounts.put(type, petTypeCounts.getOrDefault(type, 0) + 1);
        }
        response.setPetTypeCounts(petTypeCounts);
        response.setPetCount(petDtos.size());

        return response;
    }
}