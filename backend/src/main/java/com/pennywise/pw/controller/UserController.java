package com.pennywise.pw.controller;

import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

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
            user.setUsername(email); // Use email as username for compatibility
            user.setEmail(email);
            user.setPassword(password);
            
            // Set role to ADMIN if email contains 'admin', otherwise USER
            String role = email.toLowerCase().contains("admin") ? "ADMIN" : "USER";
            user.setRole(role);
            logger.info("Setting user role to: " + role);
            
            // Save the user
            User savedUser = userRepository.save(user);
            logger.info("User created successfully: " + savedUser.getEmail());

            // Return user data
            response.put("id", savedUser.getId().toString());
            response.put("email", savedUser.getEmail());
            response.put("name", name); // Return the provided name for display
            response.put("role", savedUser.getRole());
            
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
                        response.put("role", user.getRole()); // Include the role in the response
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

    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("User-Email") String userEmail) {
        try {
            // Check if user is admin
            User requestingUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!"ADMIN".equals(requestingUser.getRole())) {
                return ResponseEntity.status(403).body(Map.of("error", "Unauthorized: Admin access required"));
            }

            // Get all users and map to DTO
            List<Map<String, Object>> users = userRepository.findAll().stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("email", user.getEmail());
                        userMap.put("username", user.getUsername());
                        userMap.put("role", user.getRole());
                        userMap.put("expenseCount", user.getExpenses().size());
                        userMap.put("incomeCount", user.getIncomes().size());
                        return userMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.severe("Error fetching users: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to fetch users"));
        }
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getSystemStats(@RequestHeader("User-Email") String userEmail) {
        try {
            // Check if user is admin
            User requestingUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!"ADMIN".equals(requestingUser.getRole())) {
                return ResponseEntity.status(403).body(Map.of("error", "Unauthorized: Admin access required"));
            }

            // Calculate system statistics
            List<User> allUsers = userRepository.findAll();
            long totalUsers = allUsers.size();
            long totalExpenses = allUsers.stream()
                    .mapToLong(user -> user.getExpenses().size())
                    .sum();
            long totalIncomes = allUsers.stream()
                    .mapToLong(user -> user.getIncomes().size())
                    .sum();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalExpenses", totalExpenses);
            stats.put("totalIncomes", totalIncomes);
            stats.put("activeUsers", allUsers.stream()
                    .filter(user -> !user.getExpenses().isEmpty() || !user.getIncomes().isEmpty())
                    .count());

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.severe("Error fetching system stats: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to fetch system stats"));
        }
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId, @RequestHeader("User-Email") String adminEmail) {
        try {
            // Verify admin status
            User admin = userRepository.findByEmail(adminEmail)
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            
            if (!"ADMIN".equals(admin.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only admins can delete users"));
            }

            // Find the user to delete
            User userToDelete = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Delete the user (this will cascade delete related records)
            userRepository.delete(userToDelete);
            
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            logger.severe("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }
}
