
// Dashboard Summary Component
// Provides visual overview of expense data with charts and statistics
// Technologies used:
// - Recharts for data visualization (charts)
// - Shadcn UI components for cards and tabs
// - React hooks for state management
// - Custom utility functions for data processing

import { useMemo } from "react";
import { useExpenses } from "@/context/ExpenseContext";
import { formatCurrency, getExpensesByCategory, getMonthlyTotals, calculateTotalExpenses } from "@/lib/expense-utils";
import { CategoryTotal, MonthlyTotal } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Calendar, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

export default function DashboardSummary() {
  // Access expense data from context
  const { expenses, filteredExpenses } = useExpenses();

  // Calculate summary metrics with memoization for performance
  const totalExpenses = useMemo(() => calculateTotalExpenses(filteredExpenses), [filteredExpenses]);
  const averageExpense = useMemo(() => filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0, [filteredExpenses, totalExpenses]);
  
  // Prepare data for charts
  const categoryData = useMemo(() => getExpensesByCategory(filteredExpenses), [filteredExpenses]);
  const monthlyData = useMemo(() => getMonthlyTotals(filteredExpenses), [filteredExpenses]);
  
  // Calculate trend metrics (last month vs previous month)
  const recentExpenseTotal = useMemo(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    return filteredExpenses
      .filter(expense => expense.date > lastMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const previousExpenseTotal = useMemo(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    return expenses
      .filter(expense => expense.date > twoMonthsAgo && expense.date < lastMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  // Calculate percentage change for trend indicator
  const percentChange = previousExpenseTotal > 0 
    ? ((recentExpenseTotal - previousExpenseTotal) / previousExpenseTotal) * 100 
    : 0;

  // Colors for the charts
  const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'];

  // Format month names for chart display
  const formattedMonthlyData = monthlyData.map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...item,
      name: date.toLocaleString('default', { month: 'short', year: '2-digit' })
    };
  });

  // Format category names for chart display
  const formattedCategoryData = categoryData.map(item => ({
    ...item,
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1)
  }));

  // List of top categories for the sidebar
  const categoryList = formattedCategoryData.slice(0, 5).map((category, index) => (
    <div key={category.name} className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-2" 
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span className="text-sm">{category.name}</span>
      </div>
      <span className="text-sm font-medium">{formatCurrency(category.amount)}</span>
    </div>
  ));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              For {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Spending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(recentExpenseTotal)}</div>
            <div className="flex items-center">
              {percentChange > 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
              ) : percentChange < 0 ? (
                <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : null}
              <p className={`text-xs ${percentChange > 0 ? 'text-red-500' : percentChange < 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                {percentChange !== 0 && Math.abs(percentChange).toFixed(1) + '%'} 
                {percentChange > 0 ? 'more' : percentChange < 0 ? 'less' : 'same'} than previous period
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageExpense)}</div>
            <p className="text-xs text-muted-foreground">Per expense</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {categoryData.length > 0 ? categoryData[0].category : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {categoryData.length > 0 
                ? `${formatCurrency(categoryData[0].amount)} total spending` 
                : 'No data available'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Where your money is going
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex justify-center">
              {formattedCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formattedCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {formattedCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(index) => formattedCategoryData[index as number].name}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
            <div className="mt-6">
              {categoryList.length > 0 ? (
                categoryList
              ) : (
                <p className="text-center text-muted-foreground">No categories to display</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expense Trends</CardTitle>
            <CardDescription>
              Your spending over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="line">
              <TabsList className="mb-4">
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
              <TabsContent value="line" className="h-[280px]">
                {formattedMonthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`} 
                        domain={[0, 'dataMax + 100']}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        name="Spending"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="bar" className="h-[280px]">
                {formattedMonthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedMonthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => `$${value}`}
                        domain={[0, 'dataMax + 100']}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Bar
                        dataKey="amount"
                        name="Spending"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
