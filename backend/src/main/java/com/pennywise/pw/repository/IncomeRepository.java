package com.pennywise.pw.repository;

import com.pennywise.pw.model.Income;
import com.pennywise.pw.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    
    /**
     * Find all incomes for a specific user
     * @param user The user whose incomes to find
     * @return List of incomes
     */
    List<Income> findByUser(User user);
    
    /**
     * Find all incomes for a specific user within a date range
     * @param user The user whose incomes to find
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return List of incomes
     */
    List<Income> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find all recurring incomes for a specific user
     * @param user The user whose recurring incomes to find
     * @param isRecurring Whether the income is recurring
     * @return List of recurring incomes
     */
    List<Income> findByUserAndIsRecurring(User user, boolean isRecurring);
    
    /**
     * Find all incomes for a specific user of a specific type
     * @param user The user whose incomes to find
     * @param type The type of income
     * @return List of incomes
     */
    List<Income> findByUserAndType(User user, Income.IncomeType type);

    /**
     * Find all incomes for a specific user ordered by date descending
     * @param user The user whose incomes to find
     * @return List of incomes
     */
    List<Income> findByUserOrderByDateDesc(User user);

    /**
     * Find all incomes for a specific user within a date range ordered by date descending
     * @param user The user whose incomes to find
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return List of incomes
     */
    List<Income> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    /**
     * Find all recurring incomes for a specific user ordered by date descending
     * @param user The user whose recurring incomes to find
     * @param isRecurring Whether the income is recurring
     * @return List of recurring incomes
     */
    List<Income> findByUserAndIsRecurringOrderByDateDesc(User user, boolean isRecurring);

    /**
     * Find all incomes for a specific user of a specific type ordered by date descending
     * @param user The user whose incomes to find
     * @param type The type of income
     * @return List of incomes
     */
    List<Income> findByUserAndTypeOrderByDateDesc(User user, Income.IncomeType type);

    /**
     * Find total income for a user within a date range
     * @param user The user whose total income to find
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return Total income amount
     */
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user = :user AND i.date BETWEEN :startDate AND :endDate")
    Double findTotalIncomeByUserAndDateBetween(
        @Param("user") User user,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
