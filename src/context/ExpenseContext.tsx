
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Expense, Balance } from "@/types";
import { toast } from "sonner";

// Default users
const defaultUsers: User[] = [
  { id: "user1", name: "Alex", avatar: "A" },
  { id: "user2", name: "Blake", avatar: "B" },
  { id: "user3", name: "Casey", avatar: "C" }
];

// Sample expenses for demonstration
const sampleExpenses: Expense[] = [
  {
    id: "exp1",
    description: "Dinner at Italian Restaurant",
    amount: 75,
    date: new Date(2023, 9, 15),
    paidBy: "user1",
    splitWith: ["user1", "user2", "user3"],
    category: "food",
    type: "expense"
  },
  {
    id: "exp2",
    description: "Movie tickets",
    amount: 45,
    date: new Date(2023, 9, 18),
    paidBy: "user2",
    splitWith: ["user1", "user2", "user3"],
    category: "entertainment",
    type: "expense"
  },
  {
    id: "exp3",
    description: "Grocery shopping",
    amount: 120,
    date: new Date(2023, 9, 20),
    paidBy: "user3",
    splitWith: ["user1", "user2", "user3"],
    category: "food",
    type: "expense"
  }
];

type ExpenseContextType = {
  users: User[];
  expenses: Expense[];
  activeUser: User;
  setActiveUser: (user: User) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  calculateBalances: () => Balance[];
  getNetBalance: (userId: string) => number;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage values or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("expenseTracker_users");
    return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem("expenseTracker_expenses");
    if (savedExpenses) {
      return JSON.parse(savedExpenses).map((expense: any) => ({
        ...expense,
        date: new Date(expense.date)
      }));
    }
    return sampleExpenses;
  });

  const [activeUser, setActiveUser] = useState<User>(() => {
    const savedActiveUser = localStorage.getItem("expenseTracker_activeUser");
    return savedActiveUser ? JSON.parse(savedActiveUser) : users[0];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("expenseTracker_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("expenseTracker_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("expenseTracker_activeUser", JSON.stringify(activeUser));
  }, [activeUser]);

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp${Date.now()}`
    };
    setExpenses([...expenses, expense]);
    toast.success("Expense added successfully!");
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success("Expense deleted successfully!");
  };

  // Calculate what each person owes others
  const calculateBalances = (): Balance[] => {
    const balances: Balance[] = users.map(user => ({
      userId: user.id,
      owes: {},
      isOwed: {}
    }));

    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const splitWith = expense.splitWith;
      const amountPerPerson = expense.amount / splitWith.length;

      splitWith.forEach(userId => {
        if (userId !== paidBy) {
          // Update what this person owes
          const balanceIndex = balances.findIndex(b => b.userId === userId);
          if (balanceIndex !== -1) {
            balances[balanceIndex].owes[paidBy] = 
              (balances[balanceIndex].owes[paidBy] || 0) + amountPerPerson;
          }

          // Update what the payer is owed
          const payerIndex = balances.findIndex(b => b.userId === paidBy);
          if (payerIndex !== -1) {
            balances[payerIndex].isOwed[userId] = 
              (balances[payerIndex].isOwed[userId] || 0) + amountPerPerson;
          }
        }
      });
    });

    return balances;
  };

  // Get the net balance for a user (negative means they owe money, positive means they are owed)
  const getNetBalance = (userId: string) => {
    const balances = calculateBalances();
    const userBalance = balances.find(b => b.userId === userId);
    
    if (!userBalance) return 0;
    
    const totalOwed = Object.values(userBalance.isOwed).reduce((sum, amount) => sum + amount, 0);
    const totalOwes = Object.values(userBalance.owes).reduce((sum, amount) => sum + amount, 0);
    
    return totalOwed - totalOwes;
  };

  return (
    <ExpenseContext.Provider
      value={{
        users,
        expenses,
        activeUser,
        setActiveUser,
        addExpense,
        deleteExpense,
        calculateBalances,
        getNetBalance
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
