import { Venda } from '@/types/venda';
import { formatCurrency, formatDate } from '@/lib/utils';
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
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, CheckCircle, XCircle } from 'lucide-react';

interface VendaListProps {
    vendas: Venda[];
    onView: (venda: Venda) => void;
    onUpdateStatus: (id: string, status: 'aprovada' | 'cancelada') => void;
}

export function VendaList({ vendas, onView, onUpdateStatus }: VendaListProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aprovada':
                return <Badge className="bg-green-500">APROVADA</Badge>;
            case 'pendente':
                return <Badge className="bg-yellow-500">PENDENTE</Badge>;
            case 'cancelada':
                return <Badge className="bg-red-500">CANCELADA</Badge>;
            default:
                return <Badge>{status.toUpperCase()}</Badge>;
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Itens</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendas.map((venda) => (
                            <TableRow key={venda.id}>
                                <TableCell>{formatDate(venda.data)}</TableCell>
                                <TableCell>{venda.nomeCliente}</TableCell>
                                <TableCell>{venda.itens.length} itens</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(venda.total)}
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(venda.status)}
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
                                                onClick={() => onView(venda)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                Ver Detalhes
                                            </DropdownMenuItem>
                                            {venda.status === 'pendente' && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onUpdateStatus(
                                                                venda.id,
                                                                'aprovada'
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                        Aprovar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onUpdateStatus(
                                                                venda.id,
                                                                'cancelada'
                                                            )
                                                        }
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                        Cancelar
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {vendas.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Nenhuma venda encontrada
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
