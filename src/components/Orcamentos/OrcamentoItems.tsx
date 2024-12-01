import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrcamentosStore, Item } from "@/stores/orcamentosStore";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrcamentoItemsProps {
  orcamentoId: number;
  items: Item[];
}

export function OrcamentoItems({ orcamentoId, items }: OrcamentoItemsProps) {
  const { adicionarItem, removerItem, editarItem } = useOrcamentosStore();
  const [novoItem, setNovoItem] = useState({
    nome: "",
    tipo: "",
    quantidade: 1,
  });

  const handleAdicionarItem = () => {
    if (!novoItem.nome || !novoItem.tipo) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    adicionarItem(orcamentoId, {
      id: Math.random().toString(36).substr(2, 9),
      ...novoItem,
    });

    setNovoItem({
      nome: "",
      tipo: "",
      quantidade: 1,
    });

    toast.success("Item adicionado com sucesso!");
  };

  const handleRemoverItem = (itemId: string) => {
    removerItem(orcamentoId, itemId);
    toast.success("Item removido com sucesso!");
  };

  const handleEditarItem = (item: Item) => {
    editarItem(orcamentoId, item);
    toast.success("Item atualizado com sucesso!");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Input
          placeholder="Nome do Item"
          value={novoItem.nome}
          onChange={(e) =>
            setNovoItem({ ...novoItem, nome: e.target.value })
          }
        />
        <Input
          placeholder="Tipo"
          value={novoItem.tipo}
          onChange={(e) =>
            setNovoItem({ ...novoItem, tipo: e.target.value })
          }
        />
        <Input
          type="number"
          min="1"
          placeholder="Quantidade"
          value={novoItem.quantidade}
          onChange={(e) =>
            setNovoItem({ ...novoItem, quantidade: Number(e.target.value) })
          }
        />
        <Button onClick={handleAdicionarItem}>Adicionar Item</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.tipo}</TableCell>
              <TableCell>{item.quantidade || 1}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const novoNome = prompt("Novo nome:", item.nome);
                      const novoTipo = prompt("Novo tipo:", item.tipo);
                      const novaQuantidade = prompt(
                        "Nova quantidade:",
                        (item.quantidade || 1).toString()
                      );

                      if (novoNome && novoTipo) {
                        handleEditarItem({
                          ...item,
                          nome: novoNome,
                          tipo: novoTipo,
                          quantidade: novaQuantidade ? Number(novaQuantidade) : 1,
                        });
                      }
                    }}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
