import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ListaItensOrcamento } from './ListaItensOrcamento';
import { Orcamento } from '@/types/orcamento';

const orcamentoSchema = z.object({
  data: z.date(),
  validade: z.date(),
  cliente: z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
    endereco: z.string().optional()
  }),
  prazoEntrega: z.string().min(1, 'Prazo de entrega é obrigatório'),
  formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  observacoes: z.string().optional(),
  status: z.enum(['rascunho', 'enviado', 'aprovado', 'rejeitado', 'cancelado']),
  total: z.number().min(0, 'Total deve ser um número positivo')
});

type OrcamentoFormData = z.infer<typeof orcamentoSchema>;

interface OrcamentoFormProps {
  orcamento: Orcamento;
  onSuccess?: () => void;
}

export function OrcamentoForm({ orcamento, onSuccess }: OrcamentoFormProps) {
  const { atualizarOrcamento } = useOrcamentosStore();

  const form = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      data: new Date(orcamento.data),
      validade: new Date(orcamento.validade),
      cliente: orcamento.cliente,
      prazoEntrega: orcamento.prazoEntrega,
      formaPagamento: orcamento.formaPagamento,
      observacoes: orcamento.observacoes,
      status: orcamento.status,
      total: orcamento.valorTotal || 0
    }
  });

  const onSubmit = useCallback(async (data: OrcamentoFormData) => {
    try {
      await atualizarOrcamento(orcamento.id, {
        ...orcamento,
        data: data.data.toISOString(),
        validade: data.validade.toISOString(),
        cliente: data.cliente,
        prazoEntrega: data.prazoEntrega,
        formaPagamento: data.formaPagamento,
        observacoes: data.observacoes,
        status: data.status,
        valorTotal: data.total
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
    }
  }, [orcamento, atualizarOrcamento, onSuccess]);

  const statusOptions = [
    { value: "rascunho", label: "Rascunho" },
    { value: "enviado", label: "Enviado" },
    { value: "aprovado", label: "Aprovado" }, 
    { value: "rejeitado", label: "Rejeitado" },
    { value: "cancelado", label: "Cancelado" }
  ];

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="cliente.nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(00) 00000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cliente.endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Endereço completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prazoEntrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo de Entrega</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="imediato">Imediato</SelectItem>
                      <SelectItem value="1_dia">1 dia útil</SelectItem>
                      <SelectItem value="2_dias">2 dias úteis</SelectItem>
                      <SelectItem value="5_dias">5 dias úteis</SelectItem>
                      <SelectItem value="7_dias">7 dias úteis</SelectItem>
                      <SelectItem value="15_dias">15 dias úteis</SelectItem>
                      <SelectItem value="30_dias">30 dias úteis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formaPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="total"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Observações adicionais sobre o orçamento"
                    className="h-24"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Itens do Orçamento</h3>
        <ListaItensOrcamento 
          orcamentoId={orcamento.id} 
          itens={orcamento.itens || []}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Resumo do Orçamento</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(orcamento.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Descontos:</span>
            <span>{formatCurrency(orcamento.descontos || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impostos:</span>
            <span>{formatCurrency(orcamento.impostos || 0)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatCurrency(orcamento.valorTotal || 0)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
