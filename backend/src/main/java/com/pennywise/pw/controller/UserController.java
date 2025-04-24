package com.pennywise.pw.controller;

import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = Logger.getLogger(UserController.class.getName());
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> signupRequest) {
        Map<String, Object> response = new HashMap<>();
        
        String name = signupRequest.get("name");
        String email = signupRequest.get("email");
        String password = signupRequest.get("password");
        
        if (name == null || name.trim().isEmpty()) {
            response.put("error", "Name is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("error", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            logger.info("Attempting to create user with email: " + email);
            
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                logger.warning("Email already exists: " + email);
                response.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Create new user
            User user = new User();
            user.setUsername(email); // Use email as username for simplicity
            user.setEmail(email);
            user.setPassword(password);
            user.setRole("USER");
            
            // Save the user
            User savedUser = userRepository.save(user);
            logger.info("User created successfully: " + savedUser.getEmail());

            // Return user data
            response.put("id", savedUser.getId().toString());
            response.put("email", savedUser.getEmail());
            response.put("name", name); // Frontend expects name
            response.put("role", savedUser.getRole().toLowerCase());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error creating user: " + e.getMessage());
            response.put("error", "Failed to create user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (password == null || password.trim().isEmpty()) {
            response.put("error", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            logger.info("Login attempt for user: " + email);
            
            return userRepository.findByEmail(email)
                    .filter(user -> user.getPassword().equals(password))
                    .map(user -> {
                        response.put("id", user.getId().toString());
                        response.put("email", user.getEmail());
                        response.put("name", user.getUsername()); // Use username as name for now
                        response.put("role", user.getRole().toLowerCase());
                        logger.info("Login successful for user: " + email);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        logger.warning("Login failed for user: " + email);
                        response.put("error", "Invalid credentials");
                        return ResponseEntity.badRequest().body(response);
                    });
        } catch (Exception e) {
            logger.severe("Error during login: " + e.getMessage());
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || email.trim().isEmpty()) {
            response.put("error", "Email is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            logger.info("Fetching details for user: " + email);
            
            return userRepository.findByEmail(email)
                    .map(user -> {
                        response.put("id", user.getId().toString());
                        response.put("email", user.getEmail());
                        response.put("name", user.getUsername()); // Use username as name for now
                        response.put("role", user.getRole().toLowerCase());
                        logger.info("Successfully retrieved details for user: " + email);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        logger.warning("User not found: " + email);
                        response.put("error", "User not found");
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.severe("Error fetching user details: " + e.getMessage());
            response.put("error", "Failed to fetch user details: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
