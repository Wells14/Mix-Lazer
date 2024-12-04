import React from 'react';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Relatorios() {
  const { orcamentos } = useOrcamentosStore();

  // Cálculo de métricas mensais
  const metricasMensais = orcamentos.reduce((acc, orc) => {
    const data = new Date(orc.data);
    const mes = data.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    
    if (!acc[mes]) {
      acc[mes] = {
        total: 0,
        quantidade: 0,
        aprovados: 0,
        recusados: 0,
      };
    }
    
    acc[mes].total += orc.valorTotal;
    acc[mes].quantidade++;
    if (orc.status === 'aprovado') acc[mes].aprovados++;
    if (orc.status === 'recusado') acc[mes].recusados++;
    
    return acc;
  }, {} as Record<string, any>);

  // Converte para array e ordena por data
  const relatorioMensal = Object.entries(metricasMensais)
    .map(([mes, dados]) => ({
      mes,
      ...dados,
      taxaAprovacao: (dados.aprovados / dados.quantidade * 100).toFixed(1)
    }))
    .sort((a, b) => new Date(b.mes) - new Date(a.mes));

  const exportarPDF = () => {
    // Implementar exportação para PDF
    console.log('Exportar PDF');
  };

  const exportarCSV = () => {
    // Implementar exportação para CSV
    console.log('Exportar CSV');
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-gray-600 mt-1">
            Análise mensal de orçamentos
          </p>
        </div>
        <div className="space-x-2">
          <Button onClick={exportarPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={exportarCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={imprimir} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Aprovados</TableHead>
              <TableHead>Recusados</TableHead>
              <TableHead>Taxa de Aprovação</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatorioMensal.map((relatorio) => (
              <TableRow key={relatorio.mes}>
                <TableCell className="font-medium">
                  {relatorio.mes}
                </TableCell>
                <TableCell>{relatorio.quantidade}</TableCell>
                <TableCell className="text-green-600">
                  {relatorio.aprovados}
                </TableCell>
                <TableCell className="text-red-600">
                  {relatorio.recusados}
                </TableCell>
                <TableCell>
                  {relatorio.taxaAprovacao}%
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(relatorio.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
