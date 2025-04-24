import { useState } from "react";
import { ExpenseProvider } from "@/context/ExpenseContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { formatCurrency, getExpensesByCategory, getMonthlyTotals } from "@/lib/expense-utils";
import { useExpenses } from "@/context/ExpenseContext";
import ExpenseFilters from "@/components/ExpenseFilters";

const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'];

export default function ReportsPage() {
  return (
    <ExpenseProvider>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Analyze your spending patterns
            </p>
          </div>
          
          <ExpenseFilters />
          
          <div className="space-y-6">
            <ReportsTabs />
          </div>
        </div>
      </Layout>
    </ExpenseProvider>
  );
}

function ReportsTabs() {
  const { filteredExpenses } = useExpenses();
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");
  
  const categoryData = getExpensesByCategory(filteredExpenses).map(item => ({
    ...item,
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1)
  }));
  
  // Process monthly data for charts
  const monthlyData = getMonthlyTotals(filteredExpenses).map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...item,
      name: date.toLocaleString('default', { month: 'short', year: '2-digit' })
    };
  });
  
  // Create yearly data by aggregating months with proper typing
  interface YearlyDataItem {
    year: string;
    amount: number;
  }
  
  const yearlyData = monthlyData.reduce<Record<string, YearlyDataItem>>((acc, item) => {
    const [year] = item.month.split('-');
    const yearKey = year;
    
    if (!acc[yearKey]) {
      acc[yearKey] = { year: yearKey, amount: 0 };
    }
    
    acc[yearKey].amount += item.amount;
    return acc;
  }, {});
  
  const yearlyChartData = Object.values(yearlyData).map(item => ({
    name: item.year,
    amount: item.amount
  }));
  
  const timeframeData = timeframe === "monthly" ? monthlyData : yearlyChartData;

  return (
    <Tabs defaultValue="categories">
      <TabsList className="mb-8">
        <TabsTrigger value="categories">By Category</TabsTrigger>
        <TabsTrigger value="timeline">By Timeline</TabsTrigger>
      </TabsList>
      
      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              See how your spending breaks down across different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[400px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend 
                      formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available for the selected filters</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
              <div className="space-y-4">
                {categoryData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryData.map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between border p-3 rounded-md">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="capitalize">{category.category}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(category.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No categories to display</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="timeline">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Spending Over Time</CardTitle>
              <CardDescription>
                Track how your spending has changed over time
              </CardDescription>
            </div>
            <div className="mt-4 sm:mt-0">
              <TabsList>
                <TabsTrigger 
                  value="monthly" 
                  onClick={() => setTimeframe("monthly")}
                  className={timeframe === "monthly" ? "bg-primary text-white" : ""}
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger 
                  value="yearly" 
                  onClick={() => setTimeframe("yearly")}
                  className={timeframe === "yearly" ? "bg-primary text-white" : ""}
                >
                  Yearly
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {timeframeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeframeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="amount" name="Spending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data available for the selected filters</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold text-lg mb-4">Time Period Breakdown</h3>
              {timeframeData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {timeframeData.map((period) => (
                    <div key={period.name} className="border p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{period.name}</span>
                        <span className="text-lg">{formatCurrency(period.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No data to display</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
