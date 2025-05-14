// Main App component that sets up the application structure
// Technologies used:
// - React Router for navigation
// - React Query for data fetching and caching
// - Shadcn UI components for the UI library (based on Radix UI)
// - Multiple toast providers for notifications

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import Accountants from "./pages/Accountants";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BudgetPage from "./pages/Budget";
import Income from "./pages/Income";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import { BudgetProvider } from "@/context/BudgetContext";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";

// Create a new React Query client for data fetching
const queryClient = new QueryClient();

// Component to handle root route redirection
const RootRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking authentication status, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, show onboarding page
  if (!isAuthenticated) {
    return <Onboarding />;
  }

  // If authenticated, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  // Set up React Query for data fetching and state management
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider for tooltip functionality */}
    <TooltipProvider>
      {/* Toaster components for showing notifications */}
      <Toaster />
      <Sonner />
      {/* BrowserRouter sets up client-side routing */}
      <BrowserRouter>
        <AuthProvider>
          <BudgetProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
              <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/accountants" element={<ProtectedRoute><Accountants /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              
              {/* Catch-all route for 404 errors */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BudgetProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
