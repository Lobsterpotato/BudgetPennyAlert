package com.pennywise.pw.controller;

import com.pennywise.pw.model.Budget;
import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.BudgetRepository;
import com.pennywise.pw.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetController(BudgetRepository budgetRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createBudget(@RequestBody Map<String, Object> budgetData) {
        String username = (String) budgetData.get("username");
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        try {
            User user = userOpt.get();
            String category = (String) budgetData.get("category");
            String month = (String) budgetData.get("month");
            
            // Check if budget already exists for this category and month
            Optional<Budget> existingBudget = budgetRepository.findByUserAndCategoryAndMonth(user, category, month);
            
            Budget budget;
            if (existingBudget.isPresent()) {
                // Update existing budget
                budget = existingBudget.get();
                budget.setAmount(new BigDecimal(budgetData.get("amount").toString()));
            } else {
                // Create new budget
                budget = new Budget();
                budget.setCategory(category);
                budget.setMonth(month);
                budget.setAmount(new BigDecimal(budgetData.get("amount").toString()));
                budget.setUser(user);
            }
            
            Budget savedBudget = budgetRepository.save(budget);
            
            // Format the response to match frontend expectations
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedBudget.getId().toString());
            response.put("category", savedBudget.getCategory());
            response.put("amount", savedBudget.getAmount().doubleValue());
            response.put("month", savedBudget.getMonth());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create budget: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getBudgets(@RequestParam String username, @RequestParam(required = false) String month) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        List<Budget> budgets;
        
        if (month != null && !month.isEmpty()) {
            budgets = budgetRepository.findByUserAndMonth(user, month);
        } else {
            budgets = budgetRepository.findByUser(user);
        }
        
        // Transform the data to match frontend expectations
        List<Map<String, Object>> formattedBudgets = budgets.stream()
            .map(budget -> {
                Map<String, Object> formattedBudget = new HashMap<>();
                formattedBudget.put("id", budget.getId().toString());
                formattedBudget.put("category", budget.getCategory());
                formattedBudget.put("amount", budget.getAmount().doubleValue());
                formattedBudget.put("month", budget.getMonth());
                return formattedBudget;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formattedBudgets);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable Long id, @RequestBody Map<String, Object> budgetData) {
        String username = (String) budgetData.get("username");
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        Optional<Budget> budgetOpt = budgetRepository.findById(id);
        
        if (budgetOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Budget not found");
            return ResponseEntity.notFound().build();
        }
        
        Budget budget = budgetOpt.get();
        
        // Verify the budget belongs to the user
        if (!budget.getUser().getId().equals(user.getId())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized access to budget");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        try {
            budget.setAmount(new BigDecimal(budgetData.get("amount").toString()));
            
            // Category and month can be updated if provided
            if (budgetData.containsKey("category")) {
                budget.setCategory((String) budgetData.get("category"));
            }
            
            if (budgetData.containsKey("month")) {
                budget.setMonth((String) budgetData.get("month"));
            }
            
            Budget updatedBudget = budgetRepository.save(budget);
            
            // Format the response to match frontend expectations
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedBudget.getId().toString());
            response.put("category", updatedBudget.getCategory());
            response.put("amount", updatedBudget.getAmount().doubleValue());
            response.put("month", updatedBudget.getMonth());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update budget: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id, @RequestParam String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        Optional<Budget> budgetOpt = budgetRepository.findById(id);
        
        if (budgetOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Budget not found");
            return ResponseEntity.notFound().build();
        }
        
        Budget budget = budgetOpt.get();
        
        // Verify the budget belongs to the user
        if (!budget.getUser().getId().equals(user.getId())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized access to budget");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        try {
            budgetRepository.delete(budget);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Budget deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete budget: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
