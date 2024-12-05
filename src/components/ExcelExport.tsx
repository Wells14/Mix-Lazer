import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface ExcelExportProps {
  data: any[];
  filename?: string;
  sheetName?: string;
}

export function ExcelExport({ 
  data, 
  filename = 'export.xlsx',
  sheetName = 'Sheet1'
}: ExcelExportProps) {
  const exportToExcel = () => {
    if (!window.XLSX) {
      console.error('XLSX não está carregado');
      return;
    }

    try {
      const ws = window.XLSX.utils.json_to_sheet(data);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, sheetName);
      window.XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    }
  };

  return (
    <Button onClick={exportToExcel} variant="outline" size="sm">
      <FileDown className="mr-2 h-4 w-4" />
      Exportar Excel
    </Button>
  );
}
