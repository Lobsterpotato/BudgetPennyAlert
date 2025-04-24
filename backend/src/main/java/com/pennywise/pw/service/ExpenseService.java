package com.pennywise.pw.service;

import com.pennywise.pw.model.Expense;
import com.pennywise.pw.model.User;
import com.pennywise.pw.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    
    private final ExpenseRepository expenseRepository;
    
    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }
    
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }
    
    public Optional<Expense> findById(Long id) {
        return expenseRepository.findById(id);
    }
    
    public List<Expense> findByUser(User user) {
        return expenseRepository.findByUserOrderByExpenseDateDesc(user);
    }
    
    public List<Expense> findByUserAndCategory(User user, String category) {
        return expenseRepository.findByUserAndCategoryOrderByExpenseDateDesc(user, category);
    }
    
    public void deleteExpense(Expense expense) {
        expenseRepository.delete(expense);
    }
}
