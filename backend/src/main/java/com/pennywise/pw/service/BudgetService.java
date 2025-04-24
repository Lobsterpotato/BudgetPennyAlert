package com.pennywise.pw.service;

import com.pennywise.pw.model.Budget;
import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    
    @Autowired
    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }
    
    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }
    
    public Optional<Budget> findById(Long id) {
        return budgetRepository.findById(id);
    }
    
    public List<Budget> findByUser(User user) {
        return budgetRepository.findByUser(user);
    }
    
    public List<Budget> findByUserAndMonth(User user, String month) {
        return budgetRepository.findByUserAndMonth(user, month);
    }
    
    public Optional<Budget> findByUserAndCategoryAndMonth(User user, String category, String month) {
        return budgetRepository.findByUserAndCategoryAndMonth(user, category, month);
    }
    
    public boolean existsByUserAndCategoryAndMonth(User user, String category, String month) {
        return budgetRepository.existsByUserAndCategoryAndMonth(user, category, month);
    }
    
    public void deleteBudget(Budget budget) {
        budgetRepository.delete(budget);
    }
}
