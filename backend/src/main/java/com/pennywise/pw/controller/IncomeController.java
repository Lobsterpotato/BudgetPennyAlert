package com.pennywise.pw.controller;

import com.pennywise.pw.model.Income;
import com.pennywise.pw.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeController {
    private static final Logger logger = Logger.getLogger(IncomeController.class.getName());
    
    private final IncomeService incomeService;
    
    @Autowired
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }
    
    /**
     * Get all incomes for a user
     * @param email The email of the user
     * @param month Optional month parameter in format YYYY-MM
     * @return List of incomes
     */
    @GetMapping
    public ResponseEntity<?> getIncomes(
            @RequestParam String email,
            @RequestParam(required = false) String month) {
        
        try {
            List<Income> incomes;
            
            if (month != null && !month.isEmpty()) {
                logger.info("Getting incomes for user: " + email + " for month: " + month);
                incomes = incomeService.getIncomesForMonth(email, month);
            } else {
                logger.info("Getting all incomes for user: " + email);
                incomes = incomeService.getAllIncomes(email);
            }
            
            return ResponseEntity.ok(incomes);
        } catch (Exception e) {
            logger.severe("Error getting incomes: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get total income for a user
     * @param email The email of the user
     * @param month Optional month parameter in format YYYY-MM
     * @return Total income
     */
    @GetMapping("/total")
    public ResponseEntity<?> getTotalIncome(
            @RequestParam String email,
            @RequestParam(required = false) String month) {
        
        try {
            Double total;
            
            if (month != null && !month.isEmpty()) {
                logger.info("Getting total income for user: " + email + " for month: " + month);
                total = incomeService.getTotalIncomeForMonth(email, month);
            } else {
                logger.info("Getting total income for user: " + email);
                total = incomeService.getAllIncomes(email).stream()
                    .mapToDouble(Income::getAmount)
                    .sum();
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("total", total);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Error getting total income: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get recurring incomes for a user
     * @param email The email of the user
     * @return List of recurring incomes
     */
    @GetMapping("/recurring")
    public ResponseEntity<?> getRecurringIncomes(@RequestParam String email) {
        try {
            logger.info("Getting recurring incomes for user: " + email);
            List<Income> incomes = incomeService.getRecurringIncomes(email);
            return ResponseEntity.ok(incomes);
        } catch (Exception e) {
            logger.severe("Error getting recurring incomes: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get incomes of a specific type for a user
     * @param type The income type
     * @param email The email of the user
     * @return List of incomes of the specified type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getIncomesByType(
            @PathVariable Income.IncomeType type,
            @RequestParam String email) {
        
        try {
            logger.info("Getting incomes of type: " + type + " for user: " + email);
            List<Income> incomes = incomeService.getIncomesByType(email, type);
            return ResponseEntity.ok(incomes);
        } catch (Exception e) {
            logger.severe("Error getting incomes by type: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Create a new income
     * @param incomeData The income data
     * @return The created income
     */
    @PostMapping
    public ResponseEntity<?> createIncome(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            if (email == null) {
                throw new IllegalArgumentException("Email is required");
            }

            Double amount = ((Number) request.get("amount")).doubleValue();
            String dateStr = (String) request.get("date");
            String typeStr = (String) request.get("type");
            Boolean isRecurring = (Boolean) request.get("isRecurring");
            String recurrencePattern = (String) request.get("recurrencePattern");

            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Valid amount is required");
            }
            if (typeStr == null) {
                throw new IllegalArgumentException("Income type is required");
            }

            Income income = new Income();
            income.setAmount(amount);
            income.setDate(dateStr != null ? LocalDate.parse(dateStr.split("T")[0]) : LocalDate.now());
            income.setType(Income.IncomeType.valueOf(typeStr));
            income.setRecurring(isRecurring != null && isRecurring);
            if (income.isRecurring()) {
                income.setRecurrencePattern(recurrencePattern != null ? recurrencePattern : "MONTHLY");
            }
            
            logger.info("Creating income for user: " + email);
            logger.info("Income data: " + income.toString());
            
            Income createdIncome = incomeService.createIncome(email, income);
            logger.info("Income created successfully: " + createdIncome.toString());
            return ResponseEntity.ok(createdIncome);
        } catch (IllegalArgumentException e) {
            logger.warning("Validation error creating income: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.severe("Error creating income: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to create income: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Update an existing income
     * @param id The ID of the income to update
     * @param incomeData The updated income data
     * @return The updated income
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        
        try {
            String email = (String) request.get("email");
            if (email == null) {
                throw new IllegalArgumentException("Email is required");
            }

            Double amount = ((Number) request.get("amount")).doubleValue();
            String dateStr = (String) request.get("date");
            String typeStr = (String) request.get("type");
            Boolean isRecurring = (Boolean) request.get("isRecurring");
            String recurrencePattern = (String) request.get("recurrencePattern");

            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Valid amount is required");
            }
            if (typeStr == null) {
                throw new IllegalArgumentException("Income type is required");
            }

            Income income = new Income();
            income.setAmount(amount);
            income.setDate(dateStr != null ? LocalDate.parse(dateStr.split("T")[0]) : LocalDate.now());
            income.setType(Income.IncomeType.valueOf(typeStr));
            income.setRecurring(isRecurring != null && isRecurring);
            if (income.isRecurring()) {
                income.setRecurrencePattern(recurrencePattern != null ? recurrencePattern : "MONTHLY");
            }
            
            logger.info("Updating income: " + id + " for user: " + email);
            Income updatedIncome = incomeService.updateIncome(id, email, income);
            return ResponseEntity.ok(updatedIncome);
        } catch (Exception e) {
            logger.severe("Error updating income: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Delete an income
     * @param id The ID of the income to delete
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id) {
        try {
            logger.info("Deleting income: " + id);
            boolean deleted = incomeService.deleteIncome(id);
            
            Map<String, String> response = new HashMap<>();
            if (deleted) {
                response.put("message", "Income deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Income not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.severe("Error deleting income: " + e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
