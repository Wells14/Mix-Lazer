import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { ItemOrcamento } from '@/types/orcamento';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCallback } from 'react';

interface OrcamentoItemsProps {
  orcamentoId: string;
  items: ItemOrcamento[];
}

export function OrcamentoItems({ orcamentoId, items }: OrcamentoItemsProps) {
  const { removerItemOrcamento, atualizarItemOrcamento } = useOrcamentosStore();

  const handleRemoverItem = useCallback((itemId: string) => {
    removerItemOrcamento(orcamentoId, itemId);
  }, [removerItemOrcamento, orcamentoId]);

  const handleEditarItem = useCallback((itemId: string, item: ItemOrcamento) => {
    atualizarItemOrcamento(orcamentoId, itemId, item);
  }, [atualizarItemOrcamento, orcamentoId]);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum item adicionado ao orçamento
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{item.nome}</h4>
              <p className="text-sm text-gray-500">{item.descricao}</p>
              <div className="mt-2 text-sm">
                <span>Quantidade: {item.quantidade} {item.unidade}</span>
                {item.tipo === 'produto' && (
                  <span className="ml-4">
                    Dimensões: {item.largura}x{item.altura}cm
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm">
                <span>Custo: {formatCurrency(item.custoUnitario)}</span>
                <span className="ml-4">Preço: {formatCurrency(item.precoUnitario)}</span>
                <span className="ml-4">Total: {formatCurrency(item.precoTotal)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditarItem(item.id, item)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoverItem(item.id)}
              >
                Remover
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
