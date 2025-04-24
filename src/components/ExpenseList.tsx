
// Expense List Component
// Displays a paginated table of expenses with sorting, filtering, and deletion capabilities
// Technologies used:
// - Shadcn UI Table component for data display
// - React hooks for state management
// - Tailwind CSS for styling
// - Custom utility functions for data formatting
// - Lucide React for icons

import { useState } from "react";
import { formatDate, formatCurrency } from "@/lib/expense-utils";
import { useExpenses } from "@/context/ExpenseContext";
import { Expense } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExpenseList() {
  // Access expense data and methods from context
  const { filteredExpenses, deleteExpense } = useExpenses();
  // State for pagination and delete confirmation
  const [currentPage, setCurrentPage] = useState(1);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const pageSize = 10; // Number of items per page

  // Calculate pagination values
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredExpenses.length / pageSize);

  // Set up expense for deletion
  const handleDelete = (id: string) => {
    setExpenseToDelete(id);
  };

  // Confirm and execute deletion
  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
    }
  };

  // Get color styling for different expense categories
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      food: "bg-expense-orange text-white",
      housing: "bg-expense-blue text-white",
      transportation: "bg-expense-green text-white",
      utilities: "bg-expense-purple text-white",
      entertainment: "bg-expense-pink text-white",
      healthcare: "bg-expense-red text-white",
      education: "bg-expense-yellow text-black",
      shopping: "bg-expense-blue text-white",
      personal: "bg-expense-green text-white",
      other: "bg-gray-500 text-white",
    };

    return categoryColors[category] || "bg-gray-500 text-white";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-muted-foreground mb-4">No expenses found</p>
          <p className="text-sm text-muted-foreground">
            Add an expense or adjust your filters to see results
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {expense.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getCategoryColor(expense.category)}`}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            aria-label="Open menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(expense.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredExpenses.length)} of{" "}
                {filteredExpenses.length} expenses
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <AlertDialog open={expenseToDelete !== null} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
