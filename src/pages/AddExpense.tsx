
// Add Expense page component
// Page for creating new expense records
// Uses:
// - ExpenseForm for data entry
// - React Router's useNavigate for navigation after submission

import { ExpenseProvider } from "@/context/ExpenseContext";
import Layout from "@/components/Layout";
import ExpenseForm from "@/components/ExpenseForm";
import { useNavigate } from "react-router-dom";

export default function AddExpensePage() {
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();
  
  // After successfully adding an expense, redirect to dashboard
  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <ExpenseProvider>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
            <p className="text-muted-foreground mt-1">
              Create a new expense record
            </p>
          </div>

          <div className="max-w-2xl">
            {/* Expense form with redirection on success */}
            <ExpenseForm onSuccess={handleSuccess} />
          </div>
        </div>
      </Layout>
    </ExpenseProvider>
  );
}
