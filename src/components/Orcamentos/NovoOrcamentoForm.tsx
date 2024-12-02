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
import { formatDate, addDays } from '@/utils/format';

const novoOrcamentoSchema = z.object({
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
  observacoes: z.string().optional()
});

type NovoOrcamentoFormData = z.infer<typeof novoOrcamentoSchema>;

interface NovoOrcamentoFormProps {
  onSuccess?: () => void;
}

export function NovoOrcamentoForm({ onSuccess }: NovoOrcamentoFormProps) {
  const { adicionarOrcamento } = useOrcamentosStore();

  const form = useForm<NovoOrcamentoFormData>({
    resolver: zodResolver(novoOrcamentoSchema),
    defaultValues: {
      data: new Date(),
      validade: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      cliente: {
        nome: '',
        email: '',
        telefone: '',
        endereco: ''
      },
      prazoEntrega: '',
      formaPagamento: '',
      observacoes: ''
    }
  });

  const onSubmit = useCallback(async (data: NovoOrcamentoFormData) => {
    try {
      await adicionarOrcamento({
        data: formatDate(new Date()),
        validade: formatDate(addDays(new Date(), 15)),
        cliente: {
          nome: data.cliente.nome,
          email: data.cliente.email,
          telefone: data.cliente.telefone,
          endereco: data.cliente.endereco,
        },
        prazoEntrega: data.prazoEntrega,
        formaPagamento: data.formaPagamento,
        observacoes: data.observacoes,
        status: "rascunho",
        itens: [],
        subtotal: 0,
        descontos: 0,
        impostos: 0,
        total: 0,
        custoTotal: 0,
        margemLucroTotal: 0,
        margemContribuicao: 0,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        versao: 1
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
    }
  }, [adicionarOrcamento, form, onSuccess]);

  return (
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
            Criar Orçamento
          </Button>
        </div>
      </form>
    </Form>
  );
}
