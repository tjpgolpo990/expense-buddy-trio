
import { useState } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogClose,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { EditIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const { users, activeUser, updateUserName, addUser } = useExpenseContext();
  const [newUserName, setNewUserName] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  // Handle adding a new user
  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    try {
      await addUser(newUserName);
      setNewUserName("");
    } catch (error) {
      console.error("Error in add user handler:", error);
    }
  };
  
  // Handle updating user name
  const handleUpdateUser = async () => {
    if (!editUserName.trim() || !editingUserId) {
      toast.error("Please enter a name");
      return;
    }
    
    try {
      await updateUserName(editingUserId, editUserName);
      setEditUserName("");
      setEditingUserId(null);
    } catch (error) {
      console.error("Error in update user handler:", error);
    }
  };
  
  // Set up edit dialog for a specific user
  const setupEditDialog = (userId: string, currentName: string) => {
    setEditingUserId(userId);
    setEditUserName(currentName);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Current Users</h3>
        <div className="grid gap-2">
          {users.map(user => (
            <div key={user.id} 
                 className={`flex items-center justify-between p-3 rounded-md ${
                   user.id === activeUser.id ? 'bg-primary/10 border border-primary/20' : 'bg-card'
                 }`}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                  {user.avatar || user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                {user.id === activeUser.id && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setupEditDialog(user.id, user.name)}
                  >
                    <EditIcon size={16} />
                    <span className="sr-only">Edit</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Update the name for this user.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="edit-name"
                        value={editUserName}
                        onChange={(e) => setEditUserName(e.target.value)}
                        placeholder="Enter user name"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleUpdateUser}>Save Changes</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Add New User</h3>
        <div className="flex gap-2">
          <Input
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter user name"
          />
          <Button onClick={handleAddUser}>
            <UserPlusIcon size={16} className="mr-2" />
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
}
