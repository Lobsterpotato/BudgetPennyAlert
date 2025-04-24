package com.pennywise.pw.repository;

import com.pennywise.pw.model.Expense;
import com.pennywise.pw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByUserOrderByExpenseDateDesc(User user);
    
    List<Expense> findByUserAndCategoryOrderByExpenseDateDesc(User user, String category);
}
