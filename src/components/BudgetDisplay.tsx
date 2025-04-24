import React, { useState, useEffect } from "react";
import { useBudgets } from "@/context/BudgetContext";
import { useExpenses } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { formatCurrency } from "@/lib/expense-utils";
import { Budget } from "@/types";

export default function BudgetDisplay() {
  const { budgets } = useBudgets();
  const { filteredExpenses } = useExpenses();
  const { toast } = useToast();
  const [showPercentages, setShowPercentages] = useState(true);
  const [shownAlerts, setShownAlerts] = useState<Set<string>>(new Set());

  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const checkBudgetThresholds = (budget: Budget, spent: number) => {
    const percentage = (spent / budget.amount) * 100;
    const alertKey = `${budget.id}-${percentage >= 100 ? '100' : percentage >= 75 ? '75' : '50'}`;

    if (percentage >= 100 && !shownAlerts.has(alertKey)) {
      toast({
        title: "Budget Exceeded!",
        description: `You've exceeded your ${budget.category} budget of ${formatCurrency(budget.amount)}`,
        variant: "destructive",
      });
      setShownAlerts(prev => new Set(prev).add(alertKey));
    } else if (percentage >= 75 && !shownAlerts.has(alertKey)) {
      toast({
        title: "Budget Warning",
        description: `You've used 75% of your ${budget.category} budget`,
      });
      setShownAlerts(prev => new Set(prev).add(alertKey));
    } else if (percentage >= 50 && !shownAlerts.has(alertKey)) {
      toast({
        title: "Budget Notice",
        description: `You've used 50% of your ${budget.category} budget`,
      });
      setShownAlerts(prev => new Set(prev).add(alertKey));
    }
  };

  useEffect(() => {
    budgets
      .filter(budget => budget.month === currentMonth)
      .forEach(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        checkBudgetThresholds(budget, spent);
      });
  }, [budgets, expensesByCategory]);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {budgets.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No budgets set. Add a budget to start tracking your spending.
        </div>
      ) : (
        <>
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Budget Overview</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPercentages(!showPercentages)}
            >
              {showPercentages ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {budgets
              .filter(budget => budget.month === currentMonth)
              .map(budget => {
                const spent = expensesByCategory[budget.category] || 0;
                const percentage = (spent / budget.amount) * 100;

                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize">{budget.category}</span>
                      {showPercentages ? (
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}% used
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(spent)} of {formatCurrency(budget.amount)}
                        </span>
                      )}
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`${
                        percentage >= 100 
                          ? "bg-red-200" 
                          : percentage >= 75 
                          ? "bg-yellow-200" 
                          : percentage >= 50 
                          ? "bg-blue-200" 
                          : ""
                      }`}
                    />
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
