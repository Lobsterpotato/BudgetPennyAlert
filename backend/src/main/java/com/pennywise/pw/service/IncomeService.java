package com.pennywise.pw.service;

import com.pennywise.pw.model.Income;
import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.IncomeRepository;
import com.pennywise.pw.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class IncomeService {
    private static final Logger logger = Logger.getLogger(IncomeService.class.getName());
    
    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public IncomeService(IncomeRepository incomeRepository, UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Get all incomes for a user
     * @param email The email of the user
     * @return List of incomes
     */
    public List<Income> getAllIncomes(String email) {
        logger.info("Getting all incomes for user: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return incomeRepository.findByUserOrderByDateDesc(user);
    }
    
    /**
     * Get incomes for a user within a specific month
     * @param email The email of the user
     * @param yearMonth The year and month in format YYYY-MM
     * @return List of incomes
     */
    public List<Income> getIncomesForMonth(String email, String yearMonth) {
        logger.info("Getting incomes for user: " + email + " for month: " + yearMonth);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        YearMonth ym = YearMonth.parse(yearMonth);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();
        
        return incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
    }
    
    /**
     * Get total income for a user within a specific month
     * @param email The email of the user
     * @param yearMonth The year and month in format YYYY-MM
     * @return Total income for the month
     */
    public Double getTotalIncomeForMonth(String email, String yearMonth) {
        logger.info("Getting total income for user: " + email + " for month: " + yearMonth);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        YearMonth ym = YearMonth.parse(yearMonth);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();
        
        Double total = incomeRepository.findTotalIncomeByUserAndDateBetween(user, startDate, endDate);
        return total != null ? total : 0.0;
    }
    
    /**
     * Create a new income for a user
     * @param email The email of the user
     * @param income The income to create
     * @return The created income
     */
    @Transactional
    public Income createIncome(String email, Income income) {
        logger.info("Creating income for user: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (income.getDate() == null) {
            income.setDate(LocalDate.now());
        }
        
        if (income.isRecurring() && income.getRecurrencePattern() == null) {
            income.setRecurrencePattern("MONTHLY");
        }
        
        income.setUser(user);
        Income savedIncome = incomeRepository.save(income);
        logger.info("Income created successfully: " + savedIncome.toString());
        return savedIncome;
    }
    
    /**
     * Update an existing income
     * @param id The ID of the income to update
     * @param email The email of the user
     * @param updatedIncome The updated income data
     * @return The updated income
     */
    @Transactional
    public Income updateIncome(Long id, String email, Income updatedIncome) {
        logger.info("Updating income: " + id + " for user: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Income existingIncome = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!existingIncome.getUser().getId().equals(user.getId())) {
            logger.warning("Not authorized to update this income");
            throw new RuntimeException("Not authorized to update this income");
        }

        existingIncome.setAmount(updatedIncome.getAmount());
        existingIncome.setDate(updatedIncome.getDate());
        existingIncome.setType(updatedIncome.getType());
        existingIncome.setRecurring(updatedIncome.isRecurring());
        
        if (updatedIncome.isRecurring()) {
            existingIncome.setRecurrencePattern(
                updatedIncome.getRecurrencePattern() != null ? 
                updatedIncome.getRecurrencePattern() : "MONTHLY"
            );
        }

        Income savedIncome = incomeRepository.save(existingIncome);
        logger.info("Income updated successfully: " + savedIncome.toString());
        return savedIncome;
    }
    
    /**
     * Delete an income
     * @param id The ID of the income to delete
     * @return True if deleted, false otherwise
     */
    @Transactional
    public boolean deleteIncome(Long id) {
        logger.info("Deleting income: " + id);
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        incomeRepository.delete(income);
        logger.info("Income deleted successfully");
        return true;
    }
    
    /**
     * Get all recurring incomes for a user
     * @param email The email of the user
     * @return List of recurring incomes
     */
    public List<Income> getRecurringIncomes(String email) {
        logger.info("Getting recurring incomes for user: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return incomeRepository.findByUserAndIsRecurringOrderByDateDesc(user, true);
    }

    public Optional<Income> getIncomeById(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return incomeRepository.findById(id)
                .filter(income -> income.getUser().getId().equals(user.getId()));
    }

    public List<Income> getIncomesByType(String email, Income.IncomeType type) {
        logger.info("Getting incomes of type: " + type + " for user: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return incomeRepository.findByUserAndTypeOrderByDateDesc(user, type);
    }
}
