
import { useExpenseContext } from "@/context/ExpenseContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function UserSelector() {
  const { users, activeUser, setActiveUser } = useExpenseContext();
  
  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(user => user.id === userId);
    if (selectedUser) {
      setActiveUser(selectedUser);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium hidden sm:inline">Active User:</span>
      <Select value={activeUser.id} onValueChange={handleUserChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select User" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-xs">
                    {user.avatar || user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
