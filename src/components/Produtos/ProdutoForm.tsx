import { useState, useEffect } from 'react';
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Produto } from '@/types/produto';
import { ProdutoService } from '@/services/ProdutoService';
import { toast } from 'sonner';

const produtoSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    descricao: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
    categoria: z.string().min(1, 'Categoria é obrigatória'),
    dimensoes: z.object({
        altura: z.number().min(0, 'Altura não pode ser negativa'),
        largura: z.number().min(0, 'Largura não pode ser negativa'),
        profundidade: z.number().min(0, 'Profundidade não pode ser negativa'),
        unidade: z.enum(['cm', 'm'])
    }),
    custoProducao: z.object({
        materiais: z.number().min(0, 'Custo de materiais não pode ser negativo'),
        maoDeObra: z.number().min(0, 'Custo de mão de obra não pode ser negativo'),
        custoFixo: z.number().min(0, 'Custo fixo não pode ser negativo'),
        outros: z.number().min(0, 'Outros custos não podem ser negativos')
    }),
    precoBase: z.number().min(0, 'Preço base não pode ser negativo'),
    margemLucro: z.number().min(0, 'Margem de lucro não pode ser negativa'),
    estoque: z.number().min(0, 'Estoque não pode ser negativo'),
    estoqueMinimo: z.number().min(0, 'Estoque mínimo não pode ser negativo'),
    ativo: z.boolean(),
    tags: z.array(z.string()).optional()
});

interface ProdutoFormProps {
    produto?: Produto;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function ProdutoForm({ produto, isOpen, onClose, onSave }: ProdutoFormProps) {
    const [loading, setLoading] = useState(false);
    const [imagens, setImagens] = useState<string[]>([]);

    const form = useForm({
        resolver: zodResolver(produtoSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            categoria: '',
            dimensoes: {
                altura: 0,
                largura: 0,
                profundidade: 0,
                unidade: 'cm'
            },
            custoProducao: {
                materiais: 0,
                maoDeObra: 0,
                custoFixo: 0,
                outros: 0
            },
            precoBase: 0,
            margemLucro: 0,
            estoque: 0,
            estoqueMinimo: 0,
            ativo: true,
            tags: []
        }
    });

    useEffect(() => {
        if (produto) {
            form.reset(produto);
            setImagens(produto.imagens);
        }
    }, [produto, form]);

    const onSubmit = async (data: z.infer<typeof produtoSchema>) => {
        try {
            setLoading(true);
            const produtoData = {
                ...data,
                imagens
            };

            if (produto) {
                await ProdutoService.atualizarProduto(produto.id, produtoData);
                toast.success('Produto atualizado com sucesso!');
            } else {
                await ProdutoService.cadastrarProduto(produtoData);
                toast.success('Produto cadastrado com sucesso!');
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error('Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {produto ? 'Editar Produto' : 'Novo Produto'}
                    </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Produto</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <textarea 
                                            {...field}
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Dimensões</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {['altura', 'largura', 'profundidade'].map((dim) => (
                                    <FormField
                                        key={dim}
                                        control={form.control}
                                        name={`dimensoes.${dim}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{dim.charAt(0).toUpperCase() + dim.slice(1)}</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                
                                <FormField
                                    control={form.control}
                                    name="dimensoes.unidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unidade</FormLabel>
                                            <FormControl>
                                                <select 
                                                    {...field}
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                >
                                                    <option value="cm">cm</option>
                                                    <option value="m">m</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Custos de Produção</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries({
                                    materiais: 'Materiais',
                                    maoDeObra: 'Mão de Obra',
                                    custoFixo: 'Custo Fixo',
                                    outros: 'Outros'
                                }).map(([key, label]) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={`custoProducao.${key}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{label}</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="precoBase"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço Base</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number"
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
                                name="margemLucro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Margem de Lucro (%)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number"
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
                                name="estoque"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estoque Atual</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number"
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
                                name="estoqueMinimo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estoque Mínimo</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="ativo"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">Produto Ativo</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
