
// Mock data generator for the expense tracker application
// This file provides sample data for demonstration purposes
// In a real application, this would be replaced with API calls to a backend

import { Expense, ExpenseCategory } from "@/types";

// Function to generate a random date within the last 3 months
const getRandomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  return new Date(
    threeMonthsAgo.getTime() + 
    Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  );
};

// Function to generate a random expense amount between $5 and $500
const getRandomAmount = () => {
  return Math.round(Math.random() * 495 + 5);
};

// List of possible expense descriptions for each category
const expenseDescriptions: Record<ExpenseCategory, string[]> = {
  food: [
    "Grocery shopping", 
    "Restaurant dinner", 
    "Coffee shop", 
    "Fast food lunch", 
    "Food delivery"
  ],
  housing: [
    "Monthly rent", 
    "Mortgage payment", 
    "Home insurance", 
    "Property tax", 
    "Home repairs"
  ],
  transportation: [
    "Gas", 
    "Public transit pass", 
    "Car insurance", 
    "Vehicle maintenance", 
    "Ride sharing"
  ],
  utilities: [
    "Electricity bill", 
    "Water bill", 
    "Internet", 
    "Phone bill", 
    "Streaming services"
  ],
  entertainment: [
    "Movie tickets", 
    "Concert", 
    "Subscription services", 
    "Video games", 
    "Books"
  ],
  healthcare: [
    "Doctor visit", 
    "Prescription", 
    "Health insurance", 
    "Dental care", 
    "Vision care"
  ],
  education: [
    "Tuition", 
    "Books", 
    "Online course", 
    "School supplies", 
    "Student loan payment"
  ],
  shopping: [
    "Clothing", 
    "Electronics", 
    "Home goods", 
    "Gifts", 
    "Personal items"
  ],
  personal: [
    "Haircut", 
    "Gym membership", 
    "Personal care", 
    "Hobbies", 
    "Subscription boxes"
  ],
  other: [
    "Miscellaneous", 
    "Unexpected expense", 
    "Donation", 
    "Fees", 
    "Other payments"
  ]
};

// All categories
const categories: ExpenseCategory[] = [
  "food",
  "housing",
  "transportation",
  "utilities",
  "entertainment",
  "healthcare",
  "education",
  "shopping",
  "personal",
  "other"
];

// Generate 50 random expenses
export const generateDummyExpenses = (): Expense[] => {
  const expenses: Expense[] = [];

  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descriptions = expenseDescriptions[category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    expenses.push({
      id: `exp-${i + 1}`,
      description,
      amount: getRandomAmount(),
      date: getRandomDate(),
      category
    });
  }

  // Sort by date, newest first
  return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Export the dummy data for use in the application
export const dummyExpenses = generateDummyExpenses();
