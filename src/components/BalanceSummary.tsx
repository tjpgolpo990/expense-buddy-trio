
import { useExpenseContext } from "@/context/ExpenseContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function BalanceSummary() {
  const { users, calculateBalances, activeUser } = useExpenseContext();
  const balances = calculateBalances();
  
  const getUserBalance = (userId: string) => {
    return balances.find(balance => balance.userId === userId);
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown";
  };
  
  // Get the currently active user's balance
  const activeUserBalance = getUserBalance(activeUser.id);
  
  // Calculate who owes the active user and who the active user owes
  const getActiveUserOwes = () => {
    if (!activeUserBalance) return [];
    
    return Object.entries(activeUserBalance.owes).map(([userId, amount]) => ({
      userId,
      amount
    }));
  };
  
  const getActiveUserIsOwed = () => {
    if (!activeUserBalance) return [];
    
    return Object.entries(activeUserBalance.isOwed).map(([userId, amount]) => ({
      userId,
      amount
    }));
  };
  
  const owes = getActiveUserOwes();
  const isOwed = getActiveUserIsOwed();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Summary</CardTitle>
        <CardDescription>See what you owe and who owes you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-expense-expense" />
              You Owe
            </h3>
            {owes.length === 0 ? (
              <p className="text-muted-foreground">You don't owe anyone.</p>
            ) : (
              <ul className="space-y-3">
                {owes.map(({ userId, amount }) => (
                  <li key={userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary">
                          {getUserName(userId).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getUserName(userId)}</span>
                    </div>
                    <span className="font-medium text-expense-expense">
                      ${amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-expense-income" />
              Owed to You
            </h3>
            {isOwed.length === 0 ? (
              <p className="text-muted-foreground">No one owes you money.</p>
            ) : (
              <ul className="space-y-3">
                {isOwed.map(({ userId, amount }) => (
                  <li key={userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary">
                          {getUserName(userId).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{getUserName(userId)}</span>
                    </div>
                    <span className="font-medium text-expense-income">
                      ${amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
