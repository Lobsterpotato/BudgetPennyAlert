
// Expense Utility Functions
// A collection of helper functions for processing expense data
// These utilities handle formatting, calculations, and data transformations

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx and tailwind-merge for handling conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 * Example: Jan 15, 2023
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format a number as currency
 * Example: $1,234.56
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculate total expenses from an array of expenses
 */
export function calculateTotalExpenses(expenses: any[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Group expenses by category and calculate totals
 * Used for pie charts and category breakdowns
 */
export function getExpensesByCategory(expenses: any[]): any[] {
  const categoryTotals: Record<string, number> = {};
  
  // Sum up amounts by category
  expenses.forEach(expense => {
    const { category, amount } = expense;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });
  
  // Convert to array format for charts
  const result = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));
  
  // Sort by amount (highest first)
  return result.sort((a, b) => b.amount - a.amount);
}

/**
 * Group expenses by month and calculate totals
 * Used for line charts and trend analysis
 */
export function getMonthlyTotals(expenses: any[]): any[] {
  const monthlyTotals: Record<string, number> = {};
  
  // Group by year-month
  expenses.forEach(expense => {
    const { date, amount } = expense;
    const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyTotals[yearMonth] = (monthlyTotals[yearMonth] || 0) + amount;
  });
  
  // Convert to array format for charts
  const result = Object.entries(monthlyTotals).map(([month, amount]) => ({
    month,
    amount
  }));
  
  // Sort chronologically
  return result.sort((a, b) => {
    const [aYear, aMonth] = a.month.split('-').map(Number);
    const [bYear, bMonth] = b.month.split('-').map(Number);
    
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  });
}

/**
 * Filter expenses based on provided criteria
 * Handles search, date range, categories, and amount range
 */
export function filterExpenses(expenses: any[], filters: any = {}): any[] {
  const { 
    searchQuery, 
    startDate, 
    endDate, 
    categories, 
    minAmount, 
    maxAmount 
  } = filters;
  
  return expenses.filter(expense => {
    // Text search filter
    if (searchQuery && !expense.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (startDate && expense.date < startDate) {
      return false;
    }
    
    if (endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999);
      if (expense.date > endDateWithTime) {
        return false;
      }
    }
    
    // Category filter
    if (categories && categories.length > 0 && !categories.includes(expense.category)) {
      return false;
    }
    
    // Amount range filter
    if (minAmount !== undefined && expense.amount < minAmount) {
      return false;
    }
    
    if (maxAmount !== undefined && expense.amount > maxAmount) {
      return false;
    }
    
    return true;
  });
}
