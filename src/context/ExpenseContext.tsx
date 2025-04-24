
// Context provider for expense data management
// This is the core state management for the application
// Technologies used:
// - React Context API for state management
// - useState and useEffect hooks for reactive state updates
// - Custom hooks for accessing context data
// - Shadcn UI toast notifications

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Expense, ExpenseCategory, ExpenseFilters } from "@/types";
import { filterExpenses } from "@/lib/expense-utils";
import { useToast } from "@/hooks/use-toast";
import { expenseApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

// Define the context shape with all available methods and state
interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setFilters: (filters: ExpenseFilters) => void;
  clearFilters: () => void;
  loadExpenses: () => Promise<void>;
}

// Create the context
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with empty array
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const { toast } = useToast();
  const { user } = useAuth();

  // Apply filters whenever expenses or filters change
  useEffect(() => {
    setFilteredExpenses(filterExpenses(expenses, filters));
  }, [expenses, filters]);

  // Load expenses when user changes
  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      setExpenses([]);
    }
  }, [user]);

  // Load expenses from the backend
  const loadExpenses = async () => {
    if (!user) return;
    
    try {
      const data = await expenseApi.getExpenses(user.email);
      
      // Transform the data to match the Expense type
      const formattedExpenses: Expense[] = data.map((exp: any) => ({
        id: exp.id,
        description: exp.description,
        amount: exp.amount,
        category: exp.category as ExpenseCategory,
        date: new Date(exp.date)
      }));
      
      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive"
      });
    }
  };

  // Add a new expense
  const addExpense = async (expenseData: Omit<Expense, "id">) => {
    if (!user) return;
    
    try {
      // Prepare the data for the API
      const apiData = {
        username: user.email,
        description: expenseData.description,
        amount: expenseData.amount,
        category: expenseData.category
      };
      
      // Call the API to create the expense
      const response = await expenseApi.createExpense(apiData);
      
      // Create a new expense object with the response data
      const newExpense: Expense = {
        id: response.id,
        description: response.description,
        amount: response.amount,
        category: response.category as ExpenseCategory,
        date: new Date(response.date)
      };

      // Update the local state
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
      
      // Show success notification
      toast({
        title: "Expense Added",
        description: `$${expenseData.amount} for ${expenseData.description}`
      });
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  // Update an existing expense
  const updateExpense = async (updatedExpense: Expense) => {
    if (!user) return;
    
    try {
      // Prepare the data for the API
      const apiData = {
        username: user.email,
        description: updatedExpense.description,
        amount: updatedExpense.amount,
        category: updatedExpense.category
      };
      
      // Call the API to update the expense
      await expenseApi.updateExpense(updatedExpense.id, apiData);
      
      // Update the local state
      setExpenses(prevExpenses =>
        prevExpenses.map(expense =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
      
      toast({
        title: "Expense Updated",
        description: `Updated ${updatedExpense.description}`
      });
    } catch (error) {
      console.error('Failed to update expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive"
      });
    }
  };

  // Delete an expense
  const deleteExpense = async (id: string) => {
    if (!user) return;
    
    const expenseToDelete = expenses.find(expense => expense.id === id);
    
    try {
      // Call the API to delete the expense
      await expenseApi.deleteExpense(id, user.email);
      
      // Update the local state
      setExpenses(prevExpenses =>
        prevExpenses.filter(expense => expense.id !== id)
      );
      
      toast({
        title: "Expense Deleted",
        description: expenseToDelete 
          ? `Removed ${expenseToDelete.description}`
          : "Expense removed"
      });
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  };

  // Update filters
  const updateFilters = (newFilters: ExpenseFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Provide all the expense data and functions to components
  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        filters,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters: updateFilters,
        clearFilters,
        loadExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to access the expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
