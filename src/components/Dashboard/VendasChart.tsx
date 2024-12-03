import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendaPorPeriodo } from '@/types/dashboard';
import { formatCurrency } from '@/lib/utils';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface VendasChartProps {
    data: VendaPorPeriodo[];
}

export function VendasChart({ data }: VendasChartProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <XAxis
                                dataKey="data"
                                tickFormatter={formatDate}
                                stroke="#888888"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickFormatter={(value) => `R$ ${value}`}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload as VendaPorPeriodo;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Data
                                                        </span>
                                                        <span className="font-bold text-muted-foreground">
                                                            {formatDate(data.data)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Vendas
                                                        </span>
                                                        <span className="font-bold">
                                                            {formatCurrency(data.valor)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            Quantidade
                                                        </span>
                                                        <span className="font-bold">
                                                            {data.quantidade} itens
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="valor"
                                stroke="#2563eb"
                                fill="url(#gradient)"
                                strokeWidth={2}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
