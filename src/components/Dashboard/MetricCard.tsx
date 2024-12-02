import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function MetricCard({ title, value, icon: Icon, description, trend }: MetricCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h2 className="text-2xl font-bold mt-1">{value}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        )}
                        {trend && (
                            <p className={`text-sm mt-2 flex items-center ${
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                <span className="text-muted-foreground ml-1">vs. mês anterior</span>
                            </p>
                        )}
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
