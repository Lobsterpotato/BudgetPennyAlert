// TypeScript type definitions for the application
// This file contains all the core data models used throughout the app

// Expense record type definition
export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
};

// Available expense categories
export type ExpenseCategory = 
  | "food" 
  | "housing" 
  | "transportation" 
  | "utilities" 
  | "entertainment" 
  | "healthcare" 
  | "education" 
  | "shopping" 
  | "personal" 
  | "other";

// Budget type definition
export type Budget = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  month: string; // Format: 'YYYY-MM'
};

// Type for monthly summary data (used in charts)
export type MonthlyTotal = {
  month: string;
  amount: number;
};

// Type for category summary data (used in charts)
export type CategoryTotal = {
  category: ExpenseCategory;
  amount: number;
};

// Filters that can be applied to expenses
export type ExpenseFilters = {
  startDate?: Date;
  endDate?: Date;
  categories?: ExpenseCategory[];
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
};

// Accountant profile type
export type Accountant = {
  id: string;
  name: string;
  photo: string;
  description: string;
  specialties: string[];
  experience: number;
  hourlyRate: number;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
};

// Review type for accountant reviews
export type Review = {
  id: string;
  accountantId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: Date;
};
