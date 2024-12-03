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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cliente } from '@/types/cliente';
import { ClienteService } from '@/services/ClienteService';
import { toast } from 'sonner';
import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '@/lib/masks';

const clienteSchema = z.object({
    tipo: z.enum(['PF', 'PJ']),
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    telefone: z.string().min(14, 'Telefone inválido'),
    documento: z.string(),
    endereco: z.object({
        cep: z.string().min(9, 'CEP inválido'),
        logradouro: z.string().min(3, 'Logradouro deve ter no mínimo 3 caracteres'),
        numero: z.string().min(1, 'Número é obrigatório'),
        complemento: z.string().optional(),
        bairro: z.string().min(3, 'Bairro deve ter no mínimo 3 caracteres'),
        cidade: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres'),
        estado: z.string().length(2, 'Estado deve ter 2 caracteres')
    }),
    observacoes: z.string().optional()
});

interface ClienteFormProps {
    cliente?: Cliente;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export function ClienteForm({ cliente, isOpen, onClose, onSave }: ClienteFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            tipo: 'PF',
            nome: '',
            email: '',
            telefone: '',
            documento: '',
            endereco: {
                cep: '',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: ''
            },
            observacoes: ''
        }
    });

    useEffect(() => {
        if (cliente) {
            form.reset(cliente);
        }
    }, [cliente, form]);

    const buscarCEP = async (cep: string) => {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
            const data = await response.json();
            
            if (data.erro) {
                toast.error('CEP não encontrado');
                return;
            }

            form.setValue('endereco.logradouro', data.logradouro);
            form.setValue('endereco.bairro', data.bairro);
            form.setValue('endereco.cidade', data.localidade);
            form.setValue('endereco.estado', data.uf);
        } catch (error) {
            toast.error('Erro ao buscar CEP');
        }
    };

    const onSubmit = async (data: z.infer<typeof clienteSchema>) => {
        try {
            setLoading(true);
            if (cliente) {
                await ClienteService.atualizarCliente(cliente.id, data);
                toast.success('Cliente atualizado com sucesso!');
            } else {
                await ClienteService.cadastrarCliente(data);
                toast.success('Cliente cadastrado com sucesso!');
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error('Erro ao salvar cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Pessoa</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex space-x-4"
                                        >
                                            <FormItem className="flex items-center space-x-2">
                                                <RadioGroupItem value="PF" />
                                                <FormLabel className="font-normal">
                                                    Pessoa Física
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2">
                                                <RadioGroupItem value="PJ" />
                                                <FormLabel className="font-normal">
                                                    Pessoa Jurídica
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="documento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {form.watch('tipo') === 'PF' ? 'CPF' : 'CNPJ'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                    form.watch('tipo') === 'PF' 
                                                        ? maskCPF(value)
                                                        : maskCNPJ(value)
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Endereço</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="endereco.cep"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CEP</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    onChange={(e) => {
                                                        const maskedValue = maskCEP(e.target.value);
                                                        field.onChange(maskedValue);
                                                        if (maskedValue.length === 9) {
                                                            buscarCEP(maskedValue);
                                                        }
                                                    }}
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
                                    name="endereco.logradouro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logradouro</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endereco.numero"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="endereco.complemento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="endereco.bairro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endereco.cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endereco.estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                <Input {...field} maxLength={2} />
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
                                        <textarea 
                                            {...field}
                                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </FormControl>
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
