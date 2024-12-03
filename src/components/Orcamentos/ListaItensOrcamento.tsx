import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/format';
import { ItemOrcamento } from '@/types/orcamento';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { ItemOrcamentoForm } from './ItemOrcamentoForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PencilIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ListaItensOrcamentoProps {
  orcamentoId: string;
  itens: ItemOrcamento[];
}

export function ListaItensOrcamento({ orcamentoId, itens }: ListaItensOrcamentoProps) {
  const { adicionarItemOrcamento, atualizarItemOrcamento, removerItemOrcamento } = useOrcamentosStore();
  const [itemEditando, setItemEditando] = useState<ItemOrcamento | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [novoItem, setNovoItem] = useState(false);

  const handleNovoItem = useCallback(() => {
    setNovoItem(true);
    setDialogAberto(true);
  }, []);

  const handleEditarItem = useCallback((item: ItemOrcamento) => {
    setItemEditando(item);
    setDialogAberto(true);
  }, []);

  const handleSubmitEdicao = useCallback(async (item: ItemOrcamento) => {
    try {
      if (novoItem) {
        await adicionarItemOrcamento(orcamentoId, item);
        toast.success('Item adicionado com sucesso');
      } else if (itemEditando) {
        await atualizarItemOrcamento(orcamentoId, itemEditando.id, item);
        toast.success('Item atualizado com sucesso');
      }
      setDialogAberto(false);
      setItemEditando(null);
      setNovoItem(false);
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar item');
    }
  }, [orcamentoId, itemEditando, novoItem, adicionarItemOrcamento, atualizarItemOrcamento]);

  const handleRemoverItem = useCallback(async (itemId: string) => {
    try {
      await removerItemOrcamento(orcamentoId, itemId);
      toast.success('Item removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover item');
    }
  }, [orcamentoId, removerItemOrcamento]);

  const handleFecharDialog = useCallback(() => {
    setDialogAberto(false);
    setItemEditando(null);
    setNovoItem(false);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Itens do Orçamento</h3>
        <Button onClick={handleNovoItem}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Dimensões</TableHead>
              <TableHead>Custo Unit.</TableHead>
              <TableHead>Preço Unit.</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.unidade}</TableCell>
                <TableCell>
                  {item.largura}x{item.altura}
                </TableCell>
                <TableCell>{formatCurrency(item.custoUnitario)}</TableCell>
                <TableCell>{formatCurrency(item.precoUnitario)}</TableCell>
                <TableCell>{formatCurrency(item.precoUnitario * item.quantidade)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditarItem(item)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoverItem(item.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={dialogAberto} onOpenChange={handleFecharDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {novoItem ? 'Novo Item' : 'Editar Item'}
            </DialogTitle>
          </DialogHeader>
          <ItemOrcamentoForm
            item={itemEditando}
            onSubmit={handleSubmitEdicao}
            onCancel={handleFecharDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
