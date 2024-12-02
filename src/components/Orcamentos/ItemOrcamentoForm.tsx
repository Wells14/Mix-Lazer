import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useOrcamentosStore } from '@/stores/orcamentosStore';
import { ItemOrcamento, MargemLucro } from '@/types/orcamento';
import { useCallback } from 'react';

const formSchema = z.object({
  tipo: z.enum(['produto', 'servico']),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  largura: z.number().min(0),
  altura: z.number().min(0),
  custoUnitario: z.number().min(0),
  precoUnitario: z.number().min(0),
  precoTotal: z.number().min(0),
  margemLucro: z.object({
    tipo: z.enum(['sobre_custo', 'sobre_venda']),
    porcentagem: z.number().min(0).max(100)
  })
});

type ItemOrcamentoFormData = z.infer<typeof formSchema>;

interface ItemOrcamentoFormProps {
  orcamentoId: string;
  onSubmit: (item: ItemOrcamento) => void;
  onClose?: () => void;
  initialData?: ItemOrcamento;
}

export function ItemOrcamentoForm({ 
  orcamentoId, 
  onSubmit,
  onClose,
  initialData 
}: ItemOrcamentoFormProps) {
  const { adicionarItemOrcamento } = useOrcamentosStore();

  const form = useForm<ItemOrcamentoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: initialData?.tipo || 'produto',
      nome: initialData?.nome || '',
      descricao: initialData?.descricao || '',
      quantidade: initialData?.quantidade || 1,
      unidade: initialData?.unidade || 'un',
      largura: initialData?.largura || 0,
      altura: initialData?.altura || 0,
      custoUnitario: initialData?.custoUnitario || 0,
      precoUnitario: initialData?.precoUnitario || 0,
      precoTotal: initialData?.precoTotal || 0,
      margemLucro: {
        tipo: initialData?.margemLucro?.tipo || 'sobre_custo',
        porcentagem: initialData?.margemLucro?.porcentagem || 30
      }
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = form;

  const onSubmitForm = useCallback(async (data: ItemOrcamentoFormData) => {
    try {
      const item: Omit<ItemOrcamento, 'id'> = {
        tipo: data.tipo,
        nome: data.nome,
        descricao: data.descricao,
        quantidade: Number(data.quantidade) || 0,
        unidade: data.unidade,
        largura: Number(data.largura) || 0,
        altura: Number(data.altura) || 0,
        custoUnitario: Number(data.custoUnitario) || 0,
        precoUnitario: Number(data.precoUnitario) || 0,
        precoTotal: Number(data.precoTotal) || 0,
        custoOperacional: [],
        custoMaterial: [],
        acabamentos: [],
        margemLucro: {
          porcentagem: Number(data.margemLucro.porcentagem) || 0,
          valor: 0,
          tipo: data.margemLucro.tipo
        }
      };

      await onSubmit(item as ItemOrcamento);
      if (onClose) onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  }, [onSubmit, onClose]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="tipo">Tipo</label>
          <Select {...register('tipo')} defaultValue="produto">
            <option value="produto">Produto</option>
            <option value="servico">Serviço</option>
          </Select>
          {errors.tipo && (
            <span className="text-sm text-red-500">{errors.tipo.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="nome">Nome</label>
          <Input {...register('nome')} placeholder="Nome do item" />
          {errors.nome && (
            <span className="text-sm text-red-500">{errors.nome.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descricao">Descrição</label>
        <Textarea {...register('descricao')} placeholder="Descrição detalhada" />
        {errors.descricao && (
          <span className="text-sm text-red-500">{errors.descricao.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="quantidade">Quantidade</label>
          <Input
            {...register('quantidade', { valueAsNumber: true })}
            type="number"
            min="1"
            step="1"
          />
          {errors.quantidade && (
            <span className="text-sm text-red-500">{errors.quantidade.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="unidade">Unidade</label>
          <Select {...register('unidade')} defaultValue="un">
            <option value="un">Unidade</option>
            <option value="m">Metro</option>
            <option value="m2">Metro Quadrado</option>
            <option value="kg">Quilograma</option>
            <option value="h">Hora</option>
          </Select>
          {errors.unidade && (
            <span className="text-sm text-red-500">{errors.unidade.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="largura">Largura</label>
          <Input
            {...register('largura', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.largura && (
            <span className="text-sm text-red-500">{errors.largura.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="altura">Altura</label>
          <Input
            {...register('altura', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.altura && (
            <span className="text-sm text-red-500">{errors.altura.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="custoUnitario">Custo Unitário</label>
          <Input
            {...register('custoUnitario', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.custoUnitario && (
            <span className="text-sm text-red-500">{errors.custoUnitario.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="precoUnitario">Preço Unitário</label>
          <Input
            {...register('precoUnitario', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.precoUnitario && (
            <span className="text-sm text-red-500">{errors.precoUnitario.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="precoTotal">Preço Total</label>
          <Input
            {...register('precoTotal', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
          />
          {errors.precoTotal && (
            <span className="text-sm text-red-500">{errors.precoTotal.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="margemLucro.tipo">Tipo de Margem</label>
          <Select {...register('margemLucro.tipo')} defaultValue="sobre_custo">
            <option value="sobre_custo">Sobre Custo</option>
            <option value="sobre_venda">Sobre Venda</option>
          </Select>
          {errors.margemLucro?.tipo && (
            <span className="text-sm text-red-500">{errors.margemLucro.tipo.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Adicionar Item
        </Button>
      </div>
    </form>
  );
}
