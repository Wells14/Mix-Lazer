import { FolderIcon, PaletteIcon, Settings2Icon, PackageIcon, TruckIcon, XIcon, CheckIcon } from "lucide-react";
import Sidebar from "@/components/Layout/Sidebar";
import Header from "@/components/Layout/Header";
import StatusCard from "@/components/Dashboard/StatusCard";
import ContributionMargin from "@/components/Dashboard/ContributionMargin";
import ProductionMetrics from "@/components/Dashboard/ProductionMetrics";
import OrdersTable from "@/components/Dashboard/OrdersTable";

export default function Home() {
  const statusCards = [
    {
      icon: <FolderIcon className="text-white" size={20} />,
      label: "Aguardando",
      count: 1,
      color: "bg-[#6366f1]",
    },
    {
      icon: <PaletteIcon className="text-white" size={20} />,
      label: "Arte",
      count: 1,
      color: "bg-[#f97316]",
    },
    {
      icon: <Settings2Icon className="text-white" size={20} />,
      label: "Produção",
      count: 1,
      color: "bg-[#3b82f6]",
    },
    {
      icon: <PackageIcon className="text-white" size={20} />,
      label: "Finalizado",
      count: 0,
      color: "bg-[#166534]",
    },
    {
      icon: <TruckIcon className="text-white" size={20} />,
      label: "Expedição",
      count: 0,
      color: "bg-[#0284c7]",
    },
    {
      icon: <CheckIcon className="text-white" size={20} />,
      label: "Entregue",
      count: 1,
      color: "bg-[#0d9488]",
    },
    {
      icon: <XIcon className="text-white" size={20} />,
      label: "Cancelado",
      count: 0,
      color: "bg-[#ef4444]",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 ml-16">
        <Header />
        <div className="p-6 mt-16 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusCards.map((card, index) => (
              <StatusCard
                key={index}
                icon={card.icon}
                label={card.label}
                count={card.count}
                color={card.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContributionMargin />
            <ProductionMetrics />
          </div>

          <OrdersTable />
        </div>
      </main>
    </div>
  );
}