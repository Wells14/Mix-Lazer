import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendaPorCategoria } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface VendasPorCategoriaProps {
    data: VendaPorCategoria[];
}

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#9333ea'];

export function VendasPorCategoria({ data }: VendasPorCategoriaProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] flex justify-between items-center">
                    <ResponsiveContainer width="60%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="valor"
                                nameKey="categoria"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={(entry) => entry.categoria}
                            >
                                {data.map((_, index) => (
                                    <Cell 
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload as VendaPorCategoria;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid gap-1">
                                                    <div className="font-bold">{data.categoria}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Valor: {formatCurrency(data.valor)}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Quantidade: {data.quantidade} itens
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {data.percentual.toFixed(1)}% do total
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="w-[40%] space-y-4">
                        {data.map((item, index) => (
                            <div key={item.categoria} className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{item.categoria}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatCurrency(item.valor)}
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {item.percentual.toFixed(1)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
