import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PaletteIcon, Settings2Icon, PackageIcon, TruckIcon, XIcon, FileSignature, HandshakeIcon } from "lucide-react";

const Vendas = () => {
  const statusCards = [
    { label: "AGUARDANDO", count: 1, icon: <FileSignature className="text-white" size={24} /> },
    { label: "ARTE", count: 1, icon: <PaletteIcon className="text-white" size={24} /> },
    { label: "PRODUÇÃO", count: 1, icon: <Settings2Icon className="text-white" size={24} /> },
    { label: "FINALIZADO", count: 0, icon: <PackageIcon className="text-white" size={24} /> },
    { label: "EXPEDIÇÃO", count: 0, icon: <TruckIcon className="text-white" size={24} /> },
    { label: "ENTREGUE", count: 1, icon: <TruckIcon className="text-white" size={24} /> },
    { label: "CANCELADO", count: 0, icon: <XIcon className="text-white" size={24} /> },
    { label: "NOVO ORÇAMENTO", count: 4, icon: <FileSignature className="text-white" size={24} /> },
    { label: "EM NEGOCIAÇÃO", count: 0, icon: <HandshakeIcon className="text-white" size={24} /> },
    { label: "CANCELADO", count: 0, icon: <XIcon className="text-white" size={24} /> }
  ];

  const getStatusColor = (label: string) => {
    const colors = {
      "AGUARDANDO": "bg-[#6366f1]",
      "ARTE": "bg-[#f97316]",
      "PRODUÇÃO": "bg-[#3b82f6]",
      "FINALIZADO": "bg-[#166534]",
      "EXPEDIÇÃO": "bg-[#0284c7]",
      "ENTREGUE": "bg-[#0d9488]",
      "CANCELADO": "bg-[#ef4444]",
      "NOVO ORÇAMENTO": "bg-[#8b5cf6]",
      "EM NEGOCIAÇÃO": "bg-[#0d9488]"
    };
    return colors[label as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
          <TabsTrigger value="produto-simples">Produto Simples</TabsTrigger>
          <TabsTrigger value="pcp">PCP</TabsTrigger>
          <TabsTrigger value="pdv">PDV</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-4">
          <div className="text-2xl font-bold mb-6">PEDIDOS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statusCards.slice(0, 7).map((status, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`${getStatusColor(status.label)} p-3 rounded-lg`}>
                    {status.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{status.label}</p>
                    <h3 className="text-2xl font-semibold mt-1">{status.count}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orcamentos" className="space-y-4">
          <div className="text-2xl font-bold mb-6">ORÇAMENTOS</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusCards.slice(7).map((status, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`${getStatusColor(status.label)} p-3 rounded-lg`}>
                    {status.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{status.label}</p>
                    <h3 className="text-2xl font-semibold mt-1">{status.count}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="produto-simples">
          <div className="text-2xl font-bold">Produto Simples</div>
        </TabsContent>

        <TabsContent value="pcp">
          <div className="text-2xl font-bold">PCP</div>
        </TabsContent>

        <TabsContent value="pdv">
          <div className="text-2xl font-bold">PDV</div>
        </TabsContent>

        <TabsContent value="tarefas">
          <div className="text-2xl font-bold">Tarefas</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vendas;