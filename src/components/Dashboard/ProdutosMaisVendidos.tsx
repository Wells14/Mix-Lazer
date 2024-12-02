import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProdutoMaisVendido } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';

interface ProdutosMaisVendidosProps {
    produtos: ProdutoMaisVendido[];
}

export function ProdutosMaisVendidos({ produtos }: ProdutosMaisVendidosProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {produtos.map((produto) => (
                        <div
                            key={produto.id}
                            className="flex items-center justify-between space-x-4"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="font-bold text-primary">
                                        {produto.quantidade}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{produto.nome}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(produto.valor)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {produto.quantidade} vendas
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
