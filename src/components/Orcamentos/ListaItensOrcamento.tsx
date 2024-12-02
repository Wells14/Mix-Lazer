import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { ItemOrcamento } from '@/types/orcamento';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { ItemOrcamentoForm } from './ItemOrcamentoForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon } from '@/components/icons/pencil-icon';

interface ListaItensOrcamentoProps {
  orcamentoId: string;
  itens: ItemOrcamento[];
}

export function ListaItensOrcamento({ orcamentoId, itens }: ListaItensOrcamentoProps) {
  const { atualizarItemOrcamento } = useOrcamentosStore();
  const [itemEditando, setItemEditando] = useState<ItemOrcamento | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleEditarItem = useCallback((item: ItemOrcamento) => {
    setItemEditando(item);
    setDialogAberto(true);
  }, []);

  const handleSubmitEdicao = useCallback(async (item: ItemOrcamento) => {
    if (itemEditando) {
      await atualizarItemOrcamento(orcamentoId, itemEditando.id, item);
      setDialogAberto(false);
      setItemEditando(null);
    }
  }, [atualizarItemOrcamento, orcamentoId, itemEditando]);

  return (
    <div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço Unit.</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.quantidade} {item.unidade}</TableCell>
                <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                <TableCell>{formatCurrency(item.precoTotal)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditarItem(item)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          {itemEditando && (
            <ItemOrcamentoForm
              orcamentoId={orcamentoId}
              onSubmit={handleSubmitEdicao}
              initialData={itemEditando}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
