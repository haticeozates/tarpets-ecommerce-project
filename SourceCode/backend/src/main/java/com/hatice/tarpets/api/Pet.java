package com.hatice.tarpets.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    // Relationship: Many-to-One
    // FetchType.LAZY: Critical for performance. Does not load the User entity immediately when fetching a Pet.
    // @JsonIgnore: Excludes the User object when the API returns a list of pets.
    // This prevents infinite recursion (User -> Pet -> User...) and minimizes data payload size.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Pet() {}

    public Pet(String name, String type, User user) {
        this.name = name;
        this.type = type;
        this.user = user;
    }

    // ---- GETTERS & SETTERS ----

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

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}