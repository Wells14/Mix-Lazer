import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useConfiguracaoOrcamentoStore } from "@/stores/configuracaoOrcamentoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemOrcamento, CustoMaterial, Acabamento, CustoOperacional } from "@/types/orcamento";
import { CalculoOrcamentoService } from "@/services/calculoOrcamento";

const formSchema = z.object({
  tipo: z.enum(["produto", "servico"]),
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  quantidade: z.number().min(1, "Quantidade deve ser maior que zero"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  largura: z.number().optional(),
  altura: z.number().optional(),
  margemLucro: z.object({
    porcentagem: z.number().min(0, "Margem deve ser maior ou igual a zero"),
    tipo: z.enum(["sobre_custo", "sobre_venda"])
  })
});

interface ItemOrcamentoFormProps {
  onClose: () => void;
  onSave: (item: ItemOrcamento) => void;
  itemInicial?: Partial<ItemOrcamento>;
}

export function ItemOrcamentoForm({ onClose, onSave, itemInicial }: ItemOrcamentoFormProps) {
  const [materiais, setMateriais] = useState<CustoMaterial[]>(itemInicial?.materiais || []);
  const [acabamentos, setAcabamentos] = useState<Acabamento[]>(itemInicial?.acabamentos || []);
  const [custosOperacionais, setCustosOperacionais] = useState<CustoOperacional[]>(itemInicial?.custosOperacionais || []);
  
  const { 
    materiaisCadastrados,
    acabamentosPadrao,
    custosOperacionaisPadrao,
    margensPadrao,
    impostos
  } = useConfiguracaoOrcamentoStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: itemInicial?.tipo || "produto",
      nome: itemInicial?.nome || "",
      descricao: itemInicial?.descricao || "",
      quantidade: itemInicial?.quantidade || 1,
      unidade: itemInicial?.unidade || "un",
      largura: itemInicial?.largura || 0,
      altura: itemInicial?.altura || 0,
      margemLucro: itemInicial?.margemLucro || {
        porcentagem: margensPadrao["produto"] || 30,
        tipo: "sobre_custo" as const
      }
    }
  });

  const tipo = watch("tipo");

  const calcularPrecos = (dados: z.infer<typeof formSchema>) => {
    const item: ItemOrcamento = {
      id: itemInicial?.id || Math.random().toString(36).substr(2, 9),
      ...dados,
      materiais,
      acabamentos,
      custosOperacionais,
      impostos,
      custoUnitario: 0,
      precoUnitario: 0,
      precoTotal: 0
    };

    return CalculoOrcamentoService.calcularItem(item);
  };

  const onSubmit = (dados: z.infer<typeof formSchema>) => {
    const itemCalculado = calcularPrecos(dados);
    onSave(itemCalculado);
    onClose();
  };

  const adicionarMaterial = (material: CustoMaterial) => {
    setMateriais([...materiais, material]);
  };

  const removerMaterial = (index: number) => {
    setMateriais(materiais.filter((_, i) => i !== index));
  };

  const adicionarAcabamento = (acabamento: Acabamento) => {
    setAcabamentos([...acabamentos, acabamento]);
  };

  const removerAcabamento = (index: number) => {
    setAcabamentos(acabamentos.filter((_, i) => i !== index));
  };

  const adicionarCustoOperacional = (custo: CustoOperacional) => {
    setCustosOperacionais([...custosOperacionais, custo]);
  };

  const removerCustoOperacional = (index: number) => {
    setCustosOperacionais(custosOperacionais.filter((_, i) => i !== index));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemInicial ? "Editar Item" : "Novo Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                {...register("tipo")}
                onValueChange={(valor) => {
                  setValue("tipo", valor as "produto" | "servico");
                  setValue("margemLucro.porcentagem", margensPadrao[valor] || 30);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="servico">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nome</Label>
              <Input {...register("nome")} error={errors.nome?.message} />
            </div>
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                step="1"
                {...register("quantidade", { valueAsNumber: true })}
                error={errors.quantidade?.message}
              />
            </div>
            <div>
              <Label>Unidade</Label>
              <Input {...register("unidade")} error={errors.unidade?.message} />
            </div>
          </div>

          {/* Dimensões (apenas para produtos) */}
          {tipo === "produto" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Largura (cm)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  {...register("largura", { valueAsNumber: true })}
                />
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  {...register("altura", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {/* Materiais */}
          <div className="space-y-2">
            <Label>Materiais</Label>
            <div className="space-y-2">
              {materiais.map((material, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">{material.nome}</span>
                  <span>{material.quantidade} {material.unidade}</span>
                  <span>R$ {material.precoUnitario.toFixed(2)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerMaterial(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={(id) => {
              const material = materiaisCadastrados.find(m => m.nome === id);
              if (material) adicionarMaterial(material);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar material" />
              </SelectTrigger>
              <SelectContent>
                {materiaisCadastrados.map((material) => (
                  <SelectItem key={material.nome} value={material.nome}>
                    {material.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Acabamentos */}
          <div className="space-y-2">
            <Label>Acabamentos</Label>
            <div className="space-y-2">
              {acabamentos.map((acabamento, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">{acabamento.nome}</span>
                  <span>{acabamento.tempoEstimado}h</span>
                  <span>R$ {acabamento.custo.toFixed(2)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerAcabamento(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={(id) => {
              const acabamento = acabamentosPadrao.find(a => a.nome === id);
              if (acabamento) adicionarAcabamento(acabamento);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar acabamento" />
              </SelectTrigger>
              <SelectContent>
                {acabamentosPadrao.map((acabamento) => (
                  <SelectItem key={acabamento.nome} value={acabamento.nome}>
                    {acabamento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custos Operacionais */}
          <div className="space-y-2">
            <Label>Custos Operacionais</Label>
            <div className="space-y-2">
              {custosOperacionais.map((custo, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">{custo.nome}</span>
                  <span>{custo.tempoEstimado}h</span>
                  <span>R$ {custo.valorHora.toFixed(2)}/h</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerCustoOperacional(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
            <Select onValueChange={(id) => {
              const custo = custosOperacionaisPadrao.find(c => c.nome === id);
              if (custo) adicionarCustoOperacional(custo);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar custo operacional" />
              </SelectTrigger>
              <SelectContent>
                {custosOperacionaisPadrao.map((custo) => (
                  <SelectItem key={custo.nome} value={custo.nome}>
                    {custo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Margem de Lucro */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Margem de Lucro (%)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                {...register("margemLucro.porcentagem", { valueAsNumber: true })}
                error={errors.margemLucro?.porcentagem?.message}
              />
            </div>
            <div>
              <Label>Tipo de Margem</Label>
              <Select
                {...register("margemLucro.tipo")}
                onValueChange={(valor) => {
                  setValue("margemLucro.tipo", valor as "sobre_custo" | "sobre_venda");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sobre_custo">Sobre Custo</SelectItem>
                  <SelectItem value="sobre_venda">Sobre Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {itemInicial ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
