import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NovoCompartilhamento } from '@/types/compartilhamento';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
    titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    descricao: z.string().optional(),
    dataExpiracao: z.string().optional(),
    permissoes: z.object({
        visualizar: z.boolean(),
        editar: z.boolean(),
        compartilhar: z.boolean(),
    }),
});

interface CompartilhamentoFormProps {
    tipo: 'orcamento' | 'produto' | 'cliente';
    itemId: string;
    onSubmit: (dados: NovoCompartilhamento) => void;
    onCancel: () => void;
}

export function CompartilhamentoForm({ tipo, itemId, onSubmit, onCancel }: CompartilhamentoFormProps) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            titulo: '',
            descricao: '',
            dataExpiracao: '',
            permissoes: {
                visualizar: true,
                editar: false,
                compartilhar: false,
            },
        },
    });

    const handleSubmit = (values: z.infer<typeof schema>) => {
        onSubmit({
            tipo,
            itemId,
            ...values,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compartilhar {tipo}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="titulo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
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
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dataExpiracao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Expiração</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Permissões</FormLabel>
                            
                            <FormField
                                control={form.control}
                                name="permissoes.visualizar"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Visualizar</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="permissoes.editar"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Editar</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="permissoes.compartilhar"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Compartilhar</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                Compartilhar
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
