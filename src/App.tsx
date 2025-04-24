
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
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import Accountants from "./pages/Accountants";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import BudgetPage from "./pages/Budget"; // Import BudgetPage component
import ProtectedRoute from "./components/ProtectedRoute";
import { BudgetProvider } from "@/context/BudgetContext";

// Create a new React Query client for data fetching
const queryClient = new QueryClient();

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
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
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
