import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Vendas from "./pages/Vendas";
import Pedidos from "./pages/Pedidos";
import Orcamentos from "./pages/Orcamentos";
import Insumos from "./pages/offset/Insumos";
import Maquinas from "./pages/offset/Maquinas";
import Acabamentos from "./pages/offset/Acabamentos";
import Papeis from "./pages/offset/Papeis";
import Modelos from "./pages/offset/Modelos";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/vendas/pedidos" element={<Pedidos />} />
              <Route path="/vendas/orcamentos" element={<Orcamentos />} />
              <Route path="/offset/insumos" element={<Insumos />} />
              <Route path="/offset/maquinas" element={<Maquinas />} />
              <Route path="/offset/acabamentos" element={<Acabamentos />} />
              <Route path="/offset/papeis" element={<Papeis />} />
              <Route path="/offset/modelos" element={<Modelos />} />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;