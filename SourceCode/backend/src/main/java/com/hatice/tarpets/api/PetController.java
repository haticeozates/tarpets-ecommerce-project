package com.hatice.tarpets.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Pet Controller (REST API).
// Manages basic CRUD (Create, Read, Update, Delete) operations for pets.
// NOTE: Primary pet creation is handled via AuthController during the user registration process.
@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {

    @Autowired
    private PetRepository petRepository;

    @GetMapping
    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet) {
        return petRepository.save(pet);
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet updatedPet) {
        return petRepository.findById(id)
                .map(pet -> {
                    pet.setName(updatedPet.getName());
                    pet.setType(updatedPet.getType());
                    return petRepository.save(pet);
                })
                .orElseThrow(() -> new RuntimeException("Pet not found: " + id));
    }

    @DeleteMapping("/{id}")
    public String deletePet(@PathVariable Long id) {
        if (petRepository.existsById(id)) {
            petRepository.deleteById(id);
            return "Deleted: " + id;
        } else {
            return "Pet does not exist: " + id;
        }
    }
}