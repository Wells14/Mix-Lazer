import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ExcelExport } from '@/components/ExcelExport';
import { PDFGenerator } from '@/components/PDFGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dados de exemplo
const dadosVendas = [
  { data: '2024-01-01', cliente: 'João Silva', produto: 'Banner 3x2m', valor: 450.00 },
  { data: '2024-01-02', cliente: 'Maria Santos', produto: 'Adesivos', valor: 280.00 },
  { data: '2024-01-03', cliente: 'Pedro Costa', produto: 'Faixa 5m', valor: 650.00 },
];

export function Relatorios() {
  const [observacoes, setObservacoes] = useState('');

  // Configuração do gráfico
  const chartData = {
    labels: dadosVendas.map(d => d.data),
    datasets: [{
      label: 'Vendas',
      data: dadosVendas.map(d => d.valor),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  // Renderiza o gráfico quando o componente montar
  React.useEffect(() => {
    if (window.Chart) {
      const ctx = document.getElementById('vendasChart') as HTMLCanvasElement;
      if (ctx) {
        new window.Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Vendas por Data'
              }
            }
          }
        });
      }
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas">
          <Card className="p-6">
            {/* Gráfico de vendas */}
            <div className="mb-6">
              <canvas id="vendasChart"></canvas>
            </div>

            {/* Tabela de vendas */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Data</th>
                    <th className="text-left">Cliente</th>
                    <th className="text-left">Produto</th>
                    <th className="text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosVendas.map((venda, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{venda.data}</td>
                      <td>{venda.cliente}</td>
                      <td>{venda.produto}</td>
                      <td className="text-right">R$ {venda.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botões de exportação */}
            <div className="flex gap-2">
              <ExcelExport 
                data={dadosVendas} 
                filename="relatorio-vendas.xlsx" 
                sheetName="Vendas"
              />
              <PDFGenerator
                title="Relatório de Vendas"
                content={{
                  text: 'Relatório de vendas do período',
                  table: {
                    headers: ['Data', 'Cliente', 'Produto', 'Valor'],
                    rows: dadosVendas.map(v => [
                      v.data,
                      v.cliente,
                      v.produto,
                      `R$ ${v.valor.toFixed(2)}`
                    ])
                  }
                }}
                filename="relatorio-vendas.pdf"
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Observações do Relatório</h2>
            <RichTextEditor
              initialValue={observacoes}
              onChange={setObservacoes}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
