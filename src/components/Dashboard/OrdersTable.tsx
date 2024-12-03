import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "1",
    client: "João Silva",
    product: "Móvel Planejado",
    status: "Em Produção",
    deadline: "2024-04-20",
    value: "R$ 2.500,00"
  },
  {
    id: "2",
    client: "Maria Santos",
    product: "Banner 3x1m",
    status: "Arte",
    deadline: "2024-04-15",
    value: "R$ 180,00"
  },
  {
    id: "3",
    client: "Pedro Oliveira",
    product: "Armário sob medida",
    status: "Aguardando",
    deadline: "2024-04-25",
    value: "R$ 3.200,00"
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    "Aguardando": "bg-[#6366f1]",
    "Arte": "bg-[#f97316]",
    "Em Produção": "bg-[#3b82f6]",
    "Finalizado": "bg-[#166534]",
    "Expedição": "bg-[#0284c7]",
    "Entregue": "bg-[#0d9488]",
    "Cancelado": "bg-[#ef4444]"
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
};

const OrdersTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>{order.client}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(order.deadline).toLocaleDateString()}</TableCell>
              <TableCell>{order.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;