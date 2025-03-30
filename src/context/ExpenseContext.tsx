import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Expense, Balance } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ExpenseContextType = {
  users: User[];
  expenses: Expense[];
  activeUser: User;
  setActiveUser: (user: User) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  calculateBalances: () => Balance[];
  getNetBalance: (userId: string) => number;
  addUser: (name: string) => Promise<void>;
  updateUserName: (userId: string, newName: string) => Promise<void>;
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
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeUser, setActiveUser] = useState<User>({ id: '', name: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('*');

        if (peopleError) throw peopleError;

        if (peopleData.length > 0) {
          const fetchedUsers: User[] = peopleData.map(person => ({
            id: person.id,
            name: person.name,
            avatar: person.name.charAt(0)
          }));
          
          setUsers(fetchedUsers);
          
          if (!activeUser.id && fetchedUsers.length > 0) {
            setActiveUser(fetchedUsers[0]);
          } else if (activeUser.id) {
            const updatedActiveUser = fetchedUsers.find(u => u.id === activeUser.id);
            if (updatedActiveUser) setActiveUser(updatedActiveUser);
          }
          
          const { data: expensesData, error: expensesError } = await supabase
            .from('expenses')
            .select('*');
            
          if (expensesError) throw expensesError;
          
          if (expensesData.length > 0) {
            const fetchedExpenses: Expense[] = expensesData.map(expense => ({
              id: expense.id,
              description: expense.description || '',
              amount: expense.amount,
              date: new Date(expense.date),
              paidBy: expense.paid_by,
              splitWith: Array.isArray(expense.split_with) ? expense.split_with : [],
              category: expense.category,
              type: expense.type || 'expense'
            }));
            
            setExpenses(fetchedExpenses);
          }
        } else {
          const defaultUsers: User[] = [
            { id: "user1", name: "Alex", avatar: "A" },
            { id: "user2", name: "Blake", avatar: "B" },
            { id: "user3", name: "Casey", avatar: "C" }
          ];
          
          for (const user of defaultUsers) {
            await supabase.from('people').insert({ id: user.id, name: user.name });
          }
          
          setUsers(defaultUsers);
          setActiveUser(defaultUsers[0]);
          
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
          
          for (const expense of sampleExpenses) {
            await supabase.from('expenses').insert({
              id: expense.id,
              description: expense.description,
              amount: expense.amount,
              date: expense.date.toISOString(),
              paid_by: expense.paidBy,
              split_with: expense.splitWith,
              category: expense.category,
              type: expense.type
            });
          }
          
          setExpenses(sampleExpenses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data from Supabase");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addUser = async (name: string) => {
    try {
      const id = `user${Date.now()}`;
      const newUser: User = { id, name, avatar: name.charAt(0) };
      
      const { error } = await supabase
        .from('people')
        .insert({ id, name });
        
      if (error) throw error;
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`User ${name} added successfully!`);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
      throw error;
    }
  };

  const updateUserName = async (userId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('people')
        .update({ name: newName })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, name: newName, avatar: newName.charAt(0) } : user
        )
      );
      
      if (activeUser.id === userId) {
        setActiveUser(prev => ({ ...prev, name: newName, avatar: newName.charAt(0) }));
      }
      
      toast.success(`User name updated successfully!`);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user name");
      throw error;
    }
  };

  const addExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const id = `exp${Date.now()}`;
      const expense: Expense = {
        ...newExpense,
        id
      };
      
      const { error } = await supabase
        .from('expenses')
        .insert({
          id,
          description: expense.description,
          amount: expense.amount,
          date: expense.date.toISOString(),
          paid_by: expense.paidBy,
          split_with: expense.splitWith,
          category: expense.category,
          type: expense.type
        });
        
      if (error) throw error;
      
      setExpenses(prev => [...prev, expense]);
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

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
          const balanceIndex = balances.findIndex(b => b.userId === userId);
          if (balanceIndex !== -1) {
            balances[balanceIndex].owes[paidBy] = 
              (balances[balanceIndex].owes[paidBy] || 0) + amountPerPerson;
          }

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

  const getNetBalance = (userId: string) => {
    const balances = calculateBalances();
    const userBalance = balances.find(b => b.userId === userId);
    
    if (!userBalance) return 0;
    
    const totalOwed = Object.values(userBalance.isOwed).reduce((sum, amount) => sum + amount, 0);
    const totalOwes = Object.values(userBalance.owes).reduce((sum, amount) => sum + amount, 0);
    
    return totalOwed - totalOwes;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading data...</div>;
  }

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
        getNetBalance,
        addUser,
        updateUserName
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
