import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useOrcamentosStore } from "@/stores/orcamentosStore";
import { useConfiguracaoOrcamentoStore } from "@/stores/configuracaoOrcamentoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemOrcamento } from "@/types/orcamento";

const formSchema = z.object({
  cliente: z.object({
    nome: z.string().min(1, "Nome do cliente é obrigatório"),
    email: z.string().email("E-mail inválido"),
    telefone: z.string().min(1, "Telefone é obrigatório"),
    endereco: z.string().optional()
  }),
  data: z.date(),
  validade: z.date(),
  prazoEntrega: z.string().min(1, "Prazo de entrega é obrigatório"),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  observacoes: z.string().optional()
});

export function NovoOrcamentoForm({ onClose }: { onClose: () => void }) {
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const { criarOrcamento } = useOrcamentosStore();
  const { 
    prazosEntrega, 
    condicoesPagamento,
    produtos: produtosPredefinidos
  } = useConfiguracaoOrcamentoStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date(),
      validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      prazoEntrega: prazosEntrega[0],
      formaPagamento: condicoesPagamento[0]
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    criarOrcamento({
      ...data,
      status: "rascunho",
      itens,
      subtotal: 0,
      descontos: 0,
      impostos: 0,
      total: 0,
      custoTotal: 0,
      margemLucroTotal: 0,
      margemContribuicao: 0,
      criadoPor: "usuario_atual", // TODO: Integrar com sistema de autenticação
      data: format(data.data, "yyyy-MM-dd"),
      validade: format(data.validade, "yyyy-MM-dd")
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Orçamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados do Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  {...register("cliente.nome")}
                  error={errors.cliente?.nome?.message}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("cliente.email")}
                  error={errors.cliente?.email?.message}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  {...register("cliente.telefone")}
                  error={errors.cliente?.telefone?.message}
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  {...register("cliente.endereco")}
                />
              </div>
            </div>
          </div>

          {/* Dados do Orçamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados do Orçamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <DatePicker
                  {...register("data")}
                  error={errors.data?.message}
                />
              </div>
              <div>
                <Label>Validade</Label>
                <DatePicker
                  {...register("validade")}
                  error={errors.validade?.message}
                />
              </div>
              <div>
                <Label>Prazo de Entrega</Label>
                <Select
                  {...register("prazoEntrega")}
                  error={errors.prazoEntrega?.message}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    {prazosEntrega.map((prazo) => (
                      <SelectItem key={prazo} value={prazo}>
                        {prazo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Forma de Pagamento</Label>
                <Select
                  {...register("formaPagamento")}
                  error={errors.formaPagamento?.message}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {condicoesPagamento.map((condicao) => (
                      <SelectItem key={condicao} value={condicao}>
                        {condicao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register("observacoes")}
              className="h-24"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Orçamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
