import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiltrosRelatorio } from '@/types/relatorio';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
    tipo: z.enum(['vendas', 'produtos', 'clientes', 'financeiro'], {
        required_error: 'Selecione o tipo de relatório',
    }),
    formato: z.enum(['pdf', 'excel', 'csv'], {
        required_error: 'Selecione o formato do relatório',
    }),
    dataInicio: z.string().optional(),
    dataFim: z.string().optional(),
    incluirGraficos: z.boolean().default(true),
    incluirDetalhes: z.boolean().default(true),
});

interface RelatorioFormProps {
    onSubmit: (dados: FiltrosRelatorio) => void;
    onPreview: (dados: FiltrosRelatorio) => void;
    loading?: boolean;
}

export function RelatorioForm({ onSubmit, onPreview, loading }: RelatorioFormProps) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            incluirGraficos: true,
            incluirDetalhes: true,
        },
    });

    const handlePreview = () => {
        const values = form.getValues();
        if (form.formState.isValid) {
            onPreview(values);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gerar Relatório</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Relatório</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="vendas">
                                                Relatório de Vendas
                                            </SelectItem>
                                            <SelectItem value="produtos">
                                                Relatório de Produtos
                                            </SelectItem>
                                            <SelectItem value="clientes">
                                                Relatório de Clientes
                                            </SelectItem>
                                            <SelectItem value="financeiro">
                                                Relatório Financeiro
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="formato"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Formato</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o formato" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="excel">
                                                Excel
                                            </SelectItem>
                                            <SelectItem value="csv">CSV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dataInicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data Inicial</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataFim"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data Final</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="incluirGraficos"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Incluir Gráficos</FormLabel>
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
                            name="incluirDetalhes"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>Incluir Detalhes</FormLabel>
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

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={handlePreview}
                                disabled={loading}
                            >
                                Visualizar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? 'Gerando...' : 'Gerar Relatório'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
