
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Budget, ExpenseCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { budgetApi } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface BudgetContextType {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, "id">) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetForCategoryAndMonth: (category: ExpenseCategory, month: string) => Budget | undefined;
  loadBudgets: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load budgets when user changes
  useEffect(() => {
    if (user) {
      loadBudgets();
    } else {
      setBudgets([]);
    }
  }, [user]);

  // Load budgets from the backend
  const loadBudgets = async () => {
    if (!user) return;
    
    try {
      const data = await budgetApi.getBudgets(user.email);
      
      // Transform the data to match the Budget type
      const formattedBudgets: Budget[] = data.map((budget: any) => ({
        id: budget.id,
        category: budget.category as ExpenseCategory,
        amount: budget.amount,
        month: budget.month
      }));
      
      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Failed to load budgets:', error);
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive"
      });
    }
  };

  const addBudget = async (budgetData: Omit<Budget, "id">) => {
    if (!user) return;
    
    // Check if a budget already exists for this category and month
    const existingBudget = budgets.find(
      b => b.category === budgetData.category && b.month === budgetData.month
    );

    if (existingBudget) {
      // Update existing budget
      await updateBudget({ ...existingBudget, amount: budgetData.amount });
      return;
    }

    try {
      // Prepare the data for the API
      const apiData = {
        username: user.email,
        category: budgetData.category,
        amount: budgetData.amount,
        month: budgetData.month
      };
      
      // Call the API to create the budget
      const response = await budgetApi.createBudget(apiData);
      
      // Create a new budget object with the response data
      const newBudget: Budget = {
        id: response.id,
        category: response.category as ExpenseCategory,
        amount: response.amount,
        month: response.month
      };

      // Update the local state
      setBudgets(prev => [...prev, newBudget]);
      
      toast({
        title: "Budget Set",
        description: `Budget set for ${budgetData.category} - ${formatCurrency(budgetData.amount)}`
      });
    } catch (error) {
      console.error('Failed to add budget:', error);
      toast({
        title: "Error",
        description: "Failed to add budget",
        variant: "destructive"
      });
    }
  };

  const updateBudget = async (updatedBudget: Budget) => {
    if (!user) return;
    
    try {
      // Prepare the data for the API
      const apiData = {
        username: user.email,
        category: updatedBudget.category,
        amount: updatedBudget.amount,
        month: updatedBudget.month
      };
      
      // Call the API to update the budget
      await budgetApi.updateBudget(updatedBudget.id, apiData);
      
      // Update the local state
      setBudgets(prev =>
        prev.map(budget =>
          budget.id === updatedBudget.id ? updatedBudget : budget
        )
      );
      
      toast({
        title: "Budget Updated",
        description: `Updated budget for ${updatedBudget.category}`
      });
    } catch (error) {
      console.error('Failed to update budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive"
      });
    }
  };

  const deleteBudget = async (id: string) => {
    if (!user) return;
    
    const budgetToDelete = budgets.find(budget => budget.id === id);
    
    try {
      // Call the API to delete the budget
      await budgetApi.deleteBudget(id, user.email);
      
      // Update the local state
      setBudgets(prev =>
        prev.filter(budget => budget.id !== id)
      );
      
      toast({
        title: "Budget Removed",
        description: budgetToDelete 
          ? `Removed budget for ${budgetToDelete.category}`
          : "Budget removed"
      });
    } catch (error) {
      console.error('Failed to delete budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive"
      });
    }
  };

  const getBudgetForCategoryAndMonth = (category: ExpenseCategory, month: string) => {
    return budgets.find(
      budget => budget.category === category && budget.month === month
    );
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetForCategoryAndMonth,
        loadBudgets
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetProvider");
  }
  return context;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
