import { useState } from "react";
import { ItemOrcamento } from "@/types/orcamento";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ItemOrcamentoForm } from "./ItemOrcamentoForm";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface ListaItensOrcamentoProps {
  itens: ItemOrcamento[];
  onAdicionarItem: (item: ItemOrcamento) => void;
  onEditarItem: (id: string, item: ItemOrcamento) => void;
  onRemoverItem: (id: string) => void;
}

export function ListaItensOrcamento({
  itens,
  onAdicionarItem,
  onEditarItem,
  onRemoverItem
}: ListaItensOrcamentoProps) {
  const [showForm, setShowForm] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemOrcamento | null>(null);
  const [itensExpandidos, setItensExpandidos] = useState<string[]>([]);

  const toggleExpansao = (id: string) => {
    setItensExpandidos(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleEditarItem = (item: ItemOrcamento) => {
    setItemEmEdicao(item);
    setShowForm(true);
  };

  const handleSalvarItem = (item: ItemOrcamento) => {
    if (itemEmEdicao) {
      onEditarItem(itemEmEdicao.id, item);
    } else {
      onAdicionarItem(item);
    }
    setShowForm(false);
    setItemEmEdicao(null);
  };

  const calcularSubtotalMateriais = (item: ItemOrcamento) => {
    return item.materiais.reduce((total, material) => 
      total + material.precoUnitario * material.quantidade * (1 + material.desperdicio / 100),
      0
    );
  };

  const calcularSubtotalAcabamentos = (item: ItemOrcamento) => {
    return item.acabamentos.reduce((total, acabamento) => 
      total + acabamento.custo,
      0
    );
  };

  const calcularSubtotalOperacional = (item: ItemOrcamento) => {
    return item.custosOperacionais.reduce((total, custo) => 
      total + custo.valorHora * custo.tempoEstimado,
      0
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Itens do Orçamento</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead className="text-right">Custo Unit.</TableHead>
            <TableHead className="text-right">Preço Unit.</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itens.map((item) => (
            <>
              <TableRow key={item.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpansao(item.id)}
                  >
                    {itensExpandidos.includes(item.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.quantidade} {item.unidade}</TableCell>
                <TableCell className="text-right">
                  R$ {item.custoUnitario.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  R$ {item.precoUnitario.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  R$ {item.precoTotal.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarItem(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoverItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              
              {itensExpandidos.includes(item.id) && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="p-4 space-y-4">
                      {/* Materiais */}
                      {item.materiais.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Materiais</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Material</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead className="text-right">Preço Unit.</TableHead>
                                <TableHead className="text-right">Desperdício</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item.materiais.map((material, index) => (
                                <TableRow key={index}>
                                  <TableCell>{material.nome}</TableCell>
                                  <TableCell>{material.quantidade}</TableCell>
                                  <TableCell>{material.unidade}</TableCell>
                                  <TableCell className="text-right">
                                    R$ {material.precoUnitario.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {material.desperdicio}%
                                  </TableCell>
                                  <TableCell className="text-right">
                                    R$ {(material.precoUnitario * material.quantidade * (1 + material.desperdicio / 100)).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={5} className="text-right font-medium">
                                  Total Materiais:
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  R$ {calcularSubtotalMateriais(item).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* Acabamentos */}
                      {item.acabamentos.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Acabamentos</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Acabamento</TableHead>
                                <TableHead>Tempo (h)</TableHead>
                                <TableHead className="text-right">Custo</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item.acabamentos.map((acabamento, index) => (
                                <TableRow key={index}>
                                  <TableCell>{acabamento.nome}</TableCell>
                                  <TableCell>{acabamento.tempoEstimado}</TableCell>
                                  <TableCell className="text-right">
                                    R$ {acabamento.custo.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={2} className="text-right font-medium">
                                  Total Acabamentos:
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  R$ {calcularSubtotalAcabamentos(item).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* Custos Operacionais */}
                      {item.custosOperacionais.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Custos Operacionais</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Operação</TableHead>
                                <TableHead>Tempo (h)</TableHead>
                                <TableHead className="text-right">Valor/Hora</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item.custosOperacionais.map((custo, index) => (
                                <TableRow key={index}>
                                  <TableCell>{custo.nome}</TableCell>
                                  <TableCell>{custo.tempoEstimado}</TableCell>
                                  <TableCell className="text-right">
                                    R$ {custo.valorHora.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    R$ {(custo.valorHora * custo.tempoEstimado).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">
                                  Total Operacional:
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  R$ {calcularSubtotalOperacional(item).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {/* Resumo */}
                      <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between">
                            <span>Custo Total:</span>
                            <span>R$ {(item.custoUnitario * item.quantidade).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Margem ({item.margemLucro.porcentagem}%):</span>
                            <span>R$ {(item.precoTotal - (item.custoUnitario * item.quantidade)).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Preço Total:</span>
                            <span>R$ {item.precoTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {showForm && (
        <ItemOrcamentoForm
          onClose={() => {
            setShowForm(false);
            setItemEmEdicao(null);
          }}
          onSave={handleSalvarItem}
          itemInicial={itemEmEdicao || undefined}
        />
      )}
    </div>
  );
}
