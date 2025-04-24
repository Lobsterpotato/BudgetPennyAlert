package com.pennywise.pw.repository;

import com.pennywise.pw.model.Budget;
import com.pennywise.pw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    
    List<Budget> findByUser(User user);
    
    // Using @Query to specify the field name explicitly
    @Query("SELECT b FROM Budget b WHERE b.user = :user AND b.month = :month")
    List<Budget> findByUserAndMonth(@Param("user") User user, @Param("month") String month);
    
    @Query("SELECT b FROM Budget b WHERE b.user = :user AND b.category = :category AND b.month = :month")
    Optional<Budget> findByUserAndCategoryAndMonth(
            @Param("user") User user, 
            @Param("category") String category, 
            @Param("month") String month);
    
    @Query("SELECT COUNT(b) > 0 FROM Budget b WHERE b.user = :user AND b.category = :category AND b.month = :month")
    boolean existsByUserAndCategoryAndMonth(
            @Param("user") User user, 
            @Param("category") String category, 
            @Param("month") String month);
}
