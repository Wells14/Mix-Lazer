import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomerForm from "@/components/Customers/CustomerForm";
import CustomersTable from "@/components/Customers/CustomersTable";
import Sidebar from "@/components/Layout/Sidebar";

const Customers = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <CustomersTable />

        {showForm && (
          <CustomerForm onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Customers;