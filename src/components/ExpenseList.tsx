
import { useState } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash, ArrowUp, ArrowDown, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExpenseCategory } from "@/types";

export default function ExpenseList() {
  const { expenses, users, deleteExpense, activeUser } = useExpenseContext();
  const [filter, setFilter] = useState("all"); // "all", "paid", "involved"
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  
  // Filter expenses based on the selected filter
  const filteredExpenses = expenses
    .filter(expense => {
      if (filter === "all") return true;
      if (filter === "paid") return expense.paidBy === activeUser.id;
      if (filter === "involved") return expense.splitWith.includes(activeUser.id);
      return true;
    })
    .filter(expense => {
      if (categoryFilter === "all") return true;
      return expense.category === categoryFilter;
    })
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date, newest first
  
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense History</CardTitle>
        <CardDescription>View and manage all expenses.</CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-[250px]"
          />
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expenses</SelectItem>
                <SelectItem value="paid">Paid by Me</SelectItem>
                <SelectItem value="involved">Involving Me</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ExpenseCategory | "all")}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No expenses found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(expense.date, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {expense.type === "expense" ? (
                          <ArrowUp className="h-4 w-4 text-expense-expense" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-expense-income" />
                        )}
                        <span
                          className={expense.type === "expense" ? "text-expense-expense" : "text-expense-income"}
                        >
                          ${expense.amount.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-xs">
                            {getUserName(expense.paidBy).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{getUserName(expense.paidBy)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={expense.type === "expense" ? "bg-red-50" : "bg-green-50"}
                      >
                        {expense.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
