
import { ReactNode } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import UserSelector from "@/components/UserSelector";
import UserManagement from "@/components/UserManagement";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">ExpenseBuddy</h1>
          <div className="flex items-center gap-4">
            <UserSelector />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UsersIcon size={16} className="mr-2" />
                  Manage Users
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>User Management</DialogTitle>
                  <DialogDescription>
                    Add new users or edit existing ones.
                  </DialogDescription>
                </DialogHeader>
                <UserManagement />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          ExpenseBuddy — Split expenses with friends, made simple.
        </div>
      </footer>
    </div>
  );
}
