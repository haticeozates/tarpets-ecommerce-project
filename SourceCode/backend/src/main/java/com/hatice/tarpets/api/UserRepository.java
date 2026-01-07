package com.hatice.tarpets.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

// Data Access Object (DAO) for User entities.
// Interfaces with the 'users' table in the database.
public interface UserRepository extends JpaRepository<User, Long> {

    // Retrieves a user by their email address.
    // Core method used during the Login process.
    Optional<User> findByEmail(String email);

    // Checks if an email is already registered.
    // Used during Registration to prevent duplicate accounts.
    boolean existsByEmail(String email);

    // Optimized Query: Fetches the User AND their Pets in a single SQL query.
    // 'LEFT JOIN FETCH' ensures pets are loaded eagerly, preventing LazyLoadingException in the Controller.
    @Query("select u from User u left join fetch u.pets where u.email = :email")
    Optional<User> findByEmailFetchPets(@Param("email") String email);
}