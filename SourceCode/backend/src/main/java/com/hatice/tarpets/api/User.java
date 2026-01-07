package com.hatice.tarpets.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // JSON mapping: Frontend sends "name", we map it to "fullName".
    @JsonProperty("name")
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    // Security: Password can be written (registration) but never read back in JSON responses.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // JSON mapping: Frontend sends "phone", we map it to "phoneNumber".
    @JsonProperty("phone")
    private String phoneNumber;

    private String role;

    // ---- RELATIONSHIPS ----

    // One User -> Many Orders
    // CascadeType.ALL: If user is deleted, their orders are also deleted.
    // JsonIgnoreProperties: Prevents infinite recursion (User -> Order -> User).
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("user")
    private List<Order> orders = new ArrayList<>();

    // One User -> Many Pets
    // FetchType.LAZY: Pets are loaded only when explicitly requested.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("user")
    private List<Pet> pets = new ArrayList<>();

    // Temporary field to hold pet type during registration.
    // @Transient: This field is NOT stored in the database column.
    @Transient
    private String tempPetType;

    public User() {}

    // ---------- GETTERS & SETTERS ----------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Order> getOrders() { return orders; }
    public void setOrders(List<Order> orders) { this.orders = orders; }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }

    // =====================================================================
    // 🛠 FRONTEND COMPATIBILITY HELPERS
    // =====================================================================

    // 1. Handles incoming 'petType' from Registration JSON.
    // Stored temporarily in 'tempPetType' to be processed by the Controller.
    @JsonProperty("petType")
    public void setPetType(String type) {
        this.tempPetType = type;
    }

    // Accessor for the controller to read the temporary data.
    public String getTempPetType() {
        return tempPetType;
    }

    // 2. Simplifies pet data for the Frontend Profile View.
    // Instead of forcing the frontend to parse a list, we return the first pet's type as a string.
    @JsonProperty("petType")
    public String getPetTypeForFrontend() {
        if (pets != null && !pets.isEmpty()) {
            return pets.get(0).getType();
        }
        return "Not Specified";
    }

    // 3. Calculated field: Returns the total count of pets.
    // Useful for dashboard statistics.
    public Integer getPetCount() {
        if (pets != null) {
            return pets.size();
        }
        return 0;
    }
}