import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import type { NovoOrcamentoFormData } from '@/types/novoOrcamento';

const formSchema = z.object({
  cliente: z.object({
    nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido (formato: (99) 99999-9999)'),
  }),
  itens: z.array(z.object({
    id: z.string(),
    descricao: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
    quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
    valorUnitario: z.number().min(0, 'Valor unitário deve ser maior ou igual a 0'),
    valorTotal: z.number(),
  })).min(1, 'Adicione pelo menos um item'),
  observacoes: z.string().optional(),
});

interface FormularioOrcamentoProps {
  onSuccess?: () => void;
}

export function FormularioOrcamento({ onSuccess }: FormularioOrcamentoProps) {
  const { adicionarOrcamento } = useOrcamentosStore();
  const form = useForm<NovoOrcamentoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: {
        nome: '',
        email: '',
        telefone: '',
      },
      itens: [
        {
          id: crypto.randomUUID(),
          descricao: '',
          quantidade: 1,
          valorUnitario: 0,
          valorTotal: 0,
        },
      ],
      observacoes: '',
    },
  });

  function onSubmit(data: NovoOrcamentoFormData) {
    adicionarOrcamento(data);
    onSuccess?.();
    form.reset();
  }

  const adicionarItem = () => {
    const itens = form.getValues('itens');
    form.setValue('itens', [
      ...itens,
      {
        id: crypto.randomUUID(),
        descricao: '',
        quantidade: 1,
        valorUnitario: 0,
        valorTotal: 0,
      },
    ]);
  };

  const removerItem = (index: number) => {
    const itens = form.getValues('itens');
    form.setValue('itens', itens.filter((_, i) => i !== index));
  };

  const calcularValorTotal = (index: number) => {
    const itens = form.getValues('itens');
    const item = itens[index];
    const valorTotal = item.quantidade * item.valorUnitario;
    form.setValue(`itens.${index}.valorTotal`, valorTotal);
  };

  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const formatted = formatarTelefone(e.target.value);
    field.onChange(formatted);
  };

  const handleValorUnitarioChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: any) => {
    const value = e.target.value.replace(/\D/g, '');
    const numberValue = Number(value) / 100;
    field.onChange(numberValue);
    calcularValorTotal(index);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cliente.nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                    <Input 
                      {...field} 
                      onChange={(e) => handleTelefoneChange(e, field)}
                      placeholder="(99) 99999-9999"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Itens do Orçamento</h3>
            <Button type="button" variant="outline" onClick={adicionarItem}>
              Adicionar Item
            </Button>
          </div>

          {form.watch('itens').map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-5">
                <FormField
                  control={form.control}
                  name={`itens.${index}.descricao`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`itens.${index}.quantidade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qtd</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            calcularValorTotal(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`itens.${index}.valorUnitario`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Unitário</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={formatarMoeda(field.value)}
                          onChange={(e) => handleValorUnitarioChange(e, index, field)}
                          placeholder="0,00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`itens.${index}.valorTotal`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 pt-8">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removerItem(index)}
                  disabled={form.watch('itens').length === 1}
                >
                  <span className="sr-only">Remover item</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salvar Orçamento</Button>
      </form>
    </Form>
  );
}
