
import { useExpenseContext } from "@/context/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Wallet } from "lucide-react";

export default function DashboardStats() {
  const { expenses, activeUser, getNetBalance } = useExpenseContext();
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => {
    if (expense.type === "expense") {
      return sum + expense.amount;
    }
    return sum;
  }, 0);
  
  // Calculate personal expenses (where the active user is involved)
  const personalExpenses = expenses.reduce((sum, expense) => {
    if (expense.splitWith.includes(activeUser.id) && expense.type === "expense") {
      // If expense is split, calculate the user's share
      const amountPerPerson = expense.amount / expense.splitWith.length;
      return sum + amountPerPerson;
    }
    return sum;
  }, 0);
  
  // Get the net balance
  const netBalance = getNetBalance(activeUser.id);
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Group Expenses</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Expenses</CardTitle>
          <ArrowUp className="h-4 w-4 text-expense-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${personalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          {netBalance >= 0 ? (
            <ArrowDown className="h-4 w-4 text-expense-income" />
          ) : (
            <ArrowUp className="h-4 w-4 text-expense-expense" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            netBalance >= 0 ? "text-expense-income" : "text-expense-expense"
          }`}>
            ${Math.abs(netBalance).toFixed(2)}
            <span className="text-sm font-normal ml-1">
              {netBalance >= 0 ? "(to receive)" : "(you owe)"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
