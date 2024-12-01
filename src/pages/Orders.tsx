import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderForm from "@/components/Orders/OrderForm";
import OrdersTable from "@/components/Orders/OrdersTable";

const Orders = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      <OrdersTable />

      {showForm && (
        <OrderForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Orders;