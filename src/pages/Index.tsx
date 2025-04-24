import { ExpenseProvider } from "@/context/ExpenseContext";
import { BudgetProvider } from "@/context/BudgetContext";
import Layout from "@/components/Layout";
import DashboardSummary from "@/components/DashboardSummary";
import ExpenseFilters from "@/components/ExpenseFilters";
import ExpenseList from "@/components/ExpenseList";
import BudgetDisplay from "@/components/BudgetDisplay";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'expenses' | 'budget'>('expenses');

  return (
    <BudgetProvider>
      <ExpenseProvider>
        <Layout>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your expenses
              </p>
            </div>

            <DashboardSummary />
            
            <ExpenseFilters />

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  variant={activeView === 'expenses' ? 'default' : 'outline'}
                  onClick={() => setActiveView('expenses')}
                >
                  Expenses
                </Button>
                <Button 
                  variant={activeView === 'budget' ? 'default' : 'outline'}
                  onClick={() => setActiveView('budget')}
                >
                  Budget
                </Button>
              </div>

              {activeView === 'expenses' ? (
                <ExpenseList />
              ) : (
                <BudgetDisplay />
              )}
            </div>
          </div>
        </Layout>
      </ExpenseProvider>
    </BudgetProvider>
  );
}
