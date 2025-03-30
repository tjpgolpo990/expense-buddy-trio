
import { useExpenseContext } from "@/context/ExpenseContext";
import Layout from "@/components/Layout";
import DashboardStats from "@/components/DashboardStats";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import BalanceSummary from "@/components/BalanceSummary";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <AddExpenseForm />
        </div>
        
        <DashboardStats />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <BalanceSummary />
          <ExpenseList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
