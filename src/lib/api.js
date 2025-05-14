// API service for making requests to the backend

// Use relative URL when in development with Vite's proxy, or absolute URL otherwise
const API_URL = '/api';

// For debugging
console.log('API calls will be made to:', API_URL);

// Authentication API calls
export const authApi = {
  // Register a new user
  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Login a user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Get user details
  getUserDetails: async (email) => {
    try {
      const response = await fetch(`${API_URL}/users/${email}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user details');
      }
      
      return data;
    } catch (error) {
      console.error('Get user details error:', error);
      throw error;
    }
  },

  // Verify user session
  verifySession: async (email) => {
    try {
      const response = await fetch(`${API_URL}/users/${email}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Session invalid');
      }
      
      return data;
    } catch (error) {
      console.error('Session verification error:', error);
      throw error;
    }
  }
};

// Expense API calls
export const expenseApi = {
  // Get all expenses for a user
  getExpenses: async (username) => {
    try {
      const response = await fetch(`${API_URL}/expenses?username=${username}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch expenses');
      }
      
      return data;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  },
  
  // Create a new expense
  createExpense: async (expenseData) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create expense');
      }
      
      return data;
    } catch (error) {
      console.error('Create expense error:', error);
      throw error;
    }
  },
  
  // Update an expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update expense');
      }
      
      return data;
    } catch (error) {
      console.error('Update expense error:', error);
      throw error;
    }
  },
  
  // Delete an expense
  deleteExpense: async (id, username) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}?username=${username}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete expense');
      }
      
      return data;
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }
};

// Budget API calls
export const budgetApi = {
  // Get all budgets for a user
  getBudgets: async (username, month = null) => {
    try {
      let url = `${API_URL}/budgets?username=${username}`;
      if (month) {
        url += `&month=${month}`;
      }
      
      const response = await fetch(url);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch budgets');
      }
      
      return data;
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  },
  
  // Create a new budget
  createBudget: async (budgetData) => {
    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create budget');
      }
      
      return data;
    } catch (error) {
      console.error('Create budget error:', error);
      throw error;
    }
  },
  
  // Update a budget
  updateBudget: async (id, budgetData) => {
    try {
      const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update budget');
      }
      
      return data;
    } catch (error) {
      console.error('Update budget error:', error);
      throw error;
    }
  },
  
  // Delete a budget
  deleteBudget: async (id, username) => {
    try {
      const response = await fetch(`${API_URL}/budgets/${id}?username=${username}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete budget');
      }
      
      return data;
    } catch (error) {
      console.error('Delete budget error:', error);
      throw error;
    }
  }
};
