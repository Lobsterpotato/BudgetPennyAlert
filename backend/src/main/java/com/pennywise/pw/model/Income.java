package com.pennywise.pw.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "incomes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Income {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Income type is required")
    @Enumerated(EnumType.STRING)
    private IncomeType type;
    
    // For recurring income
    private boolean isRecurring;
    
    // For recurring income - monthly by default
    private String recurrencePattern = "MONTHLY";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    public enum IncomeType {
        SALARY,
        BUSINESS,
        INVESTMENT,
        GIFT,
        OTHER
    }

    @Override
    public String toString() {
        return "Income{" +
                "id=" + id +
                ", amount=" + amount +
                ", date=" + date +
                ", type=" + type +
                ", recurring=" + isRecurring +
                ", recurrencePattern='" + recurrencePattern + '\'' +
                ", user=" + (user != null ? user.getId() : "null") +
                '}';
    }
}
