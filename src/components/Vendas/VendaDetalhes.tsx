import { Venda } from '@/types/venda';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface VendaDetalhesProps {
    venda: Venda;
}

export function VendaDetalhes({ venda }: VendaDetalhesProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprovada':
                return 'bg-green-500';
            case 'pendente':
                return 'bg-yellow-500';
            case 'cancelada':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Detalhes da Venda</CardTitle>
                        <Badge className={getStatusColor(venda.status)}>
                            {venda.status.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Cliente</p>
                            <p className="font-medium">{venda.nomeCliente}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p className="font-medium">{formatDate(venda.data)}</p>
                        </div>
                        {venda.formaPagamento && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Forma de Pagamento
                                </p>
                                <p className="font-medium">{venda.formaPagamento}</p>
                            </div>
                        )}
                        {venda.parcelas && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Parcelas
                                </p>
                                <p className="font-medium">{venda.parcelas}x</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Itens</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-right">
                                    Quantidade
                                </TableHead>
                                <TableHead className="text-right">
                                    Preço Unit.
                                </TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {venda.itens.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.nomeProduto}</TableCell>
                                    <TableCell className="text-right">
                                        {item.quantidade}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.precoUnitario)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(item.precoTotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatCurrency(venda.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Desconto</span>
                            <span>- {formatCurrency(venda.desconto)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(venda.total)}</span>
                        </div>
                    </div>

                    {venda.observacoes && (
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                                Observações
                            </p>
                            <p className="mt-1">{venda.observacoes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
