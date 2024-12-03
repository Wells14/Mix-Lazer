import { Compartilhamento } from '@/types/compartilhamento';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompartilhamentoListProps {
    compartilhamentos: Compartilhamento[];
    onEdit: (compartilhamento: Compartilhamento) => void;
    onDelete: (id: string) => void;
}

export function CompartilhamentoList({
    compartilhamentos,
    onEdit,
    onDelete,
}: CompartilhamentoListProps) {
    const copiarLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            toast.success('Link copiado para a área de transferência');
        } catch (error) {
            toast.error('Erro ao copiar o link');
        }
    };

    const getTipoLabel = (tipo: string) => {
        switch (tipo) {
            case 'orcamento':
                return 'Orçamento';
            case 'produto':
                return 'Produto';
            case 'cliente':
                return 'Cliente';
            default:
                return tipo;
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Expira em</TableHead>
                            <TableHead>Acessos</TableHead>
                            <TableHead>Último Acesso</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {compartilhamentos.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.titulo}</TableCell>
                                <TableCell>{getTipoLabel(item.tipo)}</TableCell>
                                <TableCell>{formatDate(item.dataCompartilhamento)}</TableCell>
                                <TableCell>
                                    {item.dataExpiracao ? formatDate(item.dataExpiracao) : '-'}
                                </TableCell>
                                <TableCell>{item.acessos}</TableCell>
                                <TableCell>
                                    {item.ultimoAcesso ? formatDate(item.ultimoAcesso) : '-'}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => copiarLink(item.linkCompartilhamento)}
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copiar Link
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onEdit(item)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {compartilhamentos.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    Nenhum compartilhamento encontrado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
