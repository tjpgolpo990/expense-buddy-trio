
export type User = {
  id: string;
  name: string;
  avatar?: string;
};

export type ExpenseCategory = 
  | "food" 
  | "transportation" 
  | "housing" 
  | "utilities" 
  | "entertainment" 
  | "healthcare" 
  | "shopping" 
  | "other";

export type ExpenseType = "expense" | "income";

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  paidBy: string; // user id
  splitWith: string[]; // array of user ids
  category: ExpenseCategory;
  type: ExpenseType;
};

export type Balance = {
  userId: string;
  owes: {
    [userId: string]: number;
  };
  isOwed: {
    [userId: string]: number;
  };
};
