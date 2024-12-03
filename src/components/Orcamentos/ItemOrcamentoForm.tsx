import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ItemOrcamento } from '@/types/orcamento';

const itemOrcamentoSchema = z.object({
  tipo: z.enum(['produto', 'servico']),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  largura: z.number().min(0, 'Largura deve ser maior ou igual a 0'),
  altura: z.number().min(0, 'Altura deve ser maior ou igual a 0'),
  custoUnitario: z.number().min(0, 'Custo unitário deve ser maior ou igual a 0'),
  precoUnitario: z.number().min(0, 'Preço unitário deve ser maior ou igual a 0'),
});

type ItemOrcamentoFormData = z.infer<typeof itemOrcamentoSchema>;

interface ItemOrcamentoFormProps {
  item?: ItemOrcamento;
  onSubmit: (data: ItemOrcamentoFormData) => void;
  onCancel: () => void;
}

export function ItemOrcamentoForm({ item, onSubmit, onCancel }: ItemOrcamentoFormProps) {
  const form = useForm<ItemOrcamentoFormData>({
    resolver: zodResolver(itemOrcamentoSchema),
    defaultValues: {
      tipo: item?.tipo || 'produto',
      nome: item?.nome || '',
      descricao: item?.descricao || '',
      quantidade: item?.quantidade || 1,
      unidade: item?.unidade || '',
      largura: item?.largura || 0,
      altura: item?.altura || 0,
      custoUnitario: item?.custoUnitario || 0,
      precoUnitario: item?.precoUnitario || 0,
    }
  });

  const handleSubmit = (data: ItemOrcamentoFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição detalhada do item"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="un">Unidade</SelectItem>
                    <SelectItem value="m2">Metro Quadrado</SelectItem>
                    <SelectItem value="ml">Metro Linear</SelectItem>
                    <SelectItem value="kg">Quilograma</SelectItem>
                    <SelectItem value="h">Hora</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="largura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largura</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="altura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="custoUnitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo Unitário</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="precoUnitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço Unitário</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {item ? 'Atualizar Item' : 'Adicionar Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
