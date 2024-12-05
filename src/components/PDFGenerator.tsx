import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface PDFGeneratorProps {
  title: string;
  content: {
    text?: string;
    table?: {
      headers: string[];
      rows: any[][];
    };
  };
  filename?: string;
}

export function PDFGenerator({
  title,
  content,
  filename = 'documento.pdf'
}: PDFGeneratorProps) {
  const generatePDF = () => {
    if (!window.pdfMake) {
      console.error('PDFMake não está carregado');
      return;
    }

    try {
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          text: title,
          alignment: 'center',
          margin: [0, 20],
          fontSize: 16,
          bold: true
        },
        content: [
          content.text && { text: content.text, margin: [0, 20] },
          content.table && {
            table: {
              headerRows: 1,
              widths: Array(content.table.headers.length).fill('*'),
              body: [
                content.table.headers,
                ...content.table.rows
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ].filter(Boolean),
        defaultStyle: {
          font: 'Helvetica',
          fontSize: 12
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        }
      };

      window.pdfMake.createPdf(docDefinition).download(filename);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <Button onClick={generatePDF} variant="outline" size="sm">
      <FileText className="mr-2 h-4 w-4" />
      Gerar PDF
    </Button>
  );
}
