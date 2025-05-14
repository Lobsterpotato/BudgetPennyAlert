import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface IncomeEntry {
  id: number;
  amount: number;
  date: string;
  isRecurring: boolean;
  type: 'SALARY' | 'BUSINESS' | 'INVESTMENT' | 'GIFT' | 'OTHER';
  recurrencePattern?: string;
}

export default function Income() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<IncomeEntry['type']>('SALARY');
  const [isRecurring, setIsRecurring] = useState(false);

  // Fetch income data
  const { data: incomeEntries = [], isLoading } = useQuery({
    queryKey: ['incomes', user?.email],
    queryFn: async () => {
      const response = await axios.get(`/api/incomes?email=${user?.email}`);
      return response.data;
    },
    enabled: !!user?.email
  });

  // Add income mutation
  const addIncomeMutation = useMutation({
    mutationFn: async (newIncome: Omit<IncomeEntry, 'id'>) => {
      const response = await axios.post('/api/incomes', {
        ...newIncome,
        email: user?.email
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', user?.email] });
      setAmount('');
      setType('SALARY');
      setIsRecurring(false);
      toast({
        title: "Success",
        description: "Income added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding income:', error);
      toast({
        title: "Error",
        description: "Failed to add income",
        variant: "destructive"
      });
    }
  });

  // Delete income mutation
  const deleteIncomeMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/incomes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', user?.email] });
      toast({
        title: "Success",
        description: "Income deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting income:', error);
      toast({
        title: "Error",
        description: "Failed to delete income",
        variant: "destructive"
      });
    }
  });

  const handleAddIncome = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const newIncome: Omit<IncomeEntry, 'id'> = {
      amount: Number(amount),
      date: new Date().toISOString(),
      type,
      isRecurring,
      recurrencePattern: isRecurring ? 'MONTHLY' : undefined
    };

    addIncomeMutation.mutate(newIncome);
  };

  const handleDeleteIncome = (id: number) => {
    deleteIncomeMutation.mutate(id);
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Income Management</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Income</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as IncomeEntry['type'])}
                className="w-full p-2 border rounded-md"
              >
                <option value="SALARY">Salary</option>
                <option value="BUSINESS">Business</option>
                <option value="INVESTMENT">Investment</option>
                <option value="GIFT">Gift</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
              <Label htmlFor="recurring">Monthly Recurring</Label>
            </div>

            <Button
              onClick={handleAddIncome} 
              className="w-full"
              disabled={addIncomeMutation.isPending}
            >
              {addIncomeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Income"
              )}
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Income History</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : incomeEntries.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">
              No income entries found. Add your first income entry above.
            </Card>
          ) : (
            incomeEntries.map((entry: IncomeEntry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      ${entry.amount.toFixed(2)} - {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {entry.isRecurring && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Recurring
                        </span>
                      )}
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {entry.type}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteIncome(entry.id)}
                    disabled={deleteIncomeMutation.isPending}
                  >
                    {deleteIncomeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
} 