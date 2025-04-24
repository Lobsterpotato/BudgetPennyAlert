
// Budget Management Page
// Allows users to set and manage monthly budgets for different expense categories
// Similar structure to AddExpense page for consistency

import Layout from "@/components/Layout";
import BudgetForm from "@/components/BudgetForm";
import { useNavigate } from "react-router-dom";

export default function BudgetPage() {
  // Get navigate function for programmatic navigation after successful budget setting
  const navigate = useNavigate();
  
  // Redirect to dashboard after successful budget update
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Budgets</h1>
          <p className="text-muted-foreground mt-1">
            Set monthly spending limits for each category
          </p>
        </div>

        <div className="max-w-2xl">
          <BudgetForm onSuccess={handleSuccess} />
        </div>
      </div>
    </Layout>
  );
}
