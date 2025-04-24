package com.pennywise.pw.controller;

import com.pennywise.pw.model.Expense;
import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.ExpenseRepository;
import com.pennywise.pw.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody Map<String, Object> expenseData) {
        String username = (String) expenseData.get("username");
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        try {
            User user = userOpt.get();
            Expense expense = new Expense();
            expense.setTitle((String) expenseData.get("description"));
            expense.setAmount(new java.math.BigDecimal(expenseData.get("amount").toString()));
            expense.setCategory((String) expenseData.get("category"));
            expense.setDescription((String) expenseData.get("description"));
            expense.setExpenseDate(LocalDateTime.now());
            expense.setUser(user);
            
            Expense savedExpense = expenseRepository.save(expense);
            
            // Format the response to match frontend expectations
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedExpense.getId().toString());
            response.put("description", savedExpense.getDescription());
            response.put("amount", savedExpense.getAmount().doubleValue());
            response.put("category", savedExpense.getCategory());
            response.put("date", savedExpense.getExpenseDate());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> getExpenses(@RequestParam String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        List<Expense> expenses = expenseRepository.findByUserOrderByExpenseDateDesc(user);
        
        // Transform the data to match frontend expectations
        List<Map<String, Object>> formattedExpenses = expenses.stream()
            .map(expense -> {
                Map<String, Object> formattedExpense = new HashMap<>();
                formattedExpense.put("id", expense.getId().toString());
                formattedExpense.put("description", expense.getDescription());
                formattedExpense.put("amount", expense.getAmount().doubleValue());
                formattedExpense.put("category", expense.getCategory());
                formattedExpense.put("date", expense.getExpenseDate());
                return formattedExpense;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(formattedExpenses);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Map<String, Object> expenseData) {
        String username = (String) expenseData.get("username");
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        Optional<Expense> expenseOpt = expenseRepository.findById(id);
        
        if (expenseOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Expense not found");
            return ResponseEntity.notFound().build();
        }
        
        Expense expense = expenseOpt.get();
        
        // Verify the expense belongs to the user
        if (!expense.getUser().getId().equals(user.getId())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized access to expense");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        try {
            expense.setTitle((String) expenseData.get("description"));
            expense.setAmount(new java.math.BigDecimal(expenseData.get("amount").toString()));
            expense.setCategory((String) expenseData.get("category"));
            expense.setDescription((String) expenseData.get("description"));
            
            Expense updatedExpense = expenseRepository.save(expense);
            
            // Format the response to match frontend expectations
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedExpense.getId().toString());
            response.put("description", updatedExpense.getDescription());
            response.put("amount", updatedExpense.getAmount().doubleValue());
            response.put("category", updatedExpense.getCategory());
            response.put("date", updatedExpense.getExpenseDate());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to update expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, @RequestParam String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "User not found");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User user = userOpt.get();
        Optional<Expense> expenseOpt = expenseRepository.findById(id);
        
        if (expenseOpt.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Expense not found");
            return ResponseEntity.notFound().build();
        }
        
        Expense expense = expenseOpt.get();
        
        // Verify the expense belongs to the user
        if (!expense.getUser().getId().equals(user.getId())) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Unauthorized access to expense");
            return ResponseEntity.status(403).body(errorResponse);
        }
        
        try {
            expenseRepository.delete(expense);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Expense deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
