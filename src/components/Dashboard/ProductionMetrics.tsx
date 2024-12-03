import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', producao: 400, vendas: 240 },
  { name: 'Fev', producao: 300, vendas: 139 },
  { name: 'Mar', producao: 200, vendas: 980 },
  { name: 'Abr', producao: 278, vendas: 390 },
  { name: 'Mai', producao: 189, vendas: 480 },
  { name: 'Jun', producao: 239, vendas: 380 },
];

const ProductionMetrics = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Métricas de Produção</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="producao" fill="#3b82f6" name="Produção" />
            <Bar dataKey="vendas" fill="#10b981" name="Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionMetrics;