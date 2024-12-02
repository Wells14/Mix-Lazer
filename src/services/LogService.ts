import { LogCalculo } from '../types/calculos';

export class LogService {
    private static logs: LogCalculo[] = [];

    static registrarCalculo(tipo: string, valores: Record<string, number>, resultado: number): void {
        const log: LogCalculo = {
            timestamp: new Date(),
            tipo,
            valores,
            resultado
        };
        
        this.logs.push(log);
        console.log(`[${log.timestamp.toISOString()}] Cálculo ${tipo}:`, { valores, resultado });
    }

    static obterHistorico(): LogCalculo[] {
        return [...this.logs];
    }

    static limparHistorico(): void {
        this.logs = [];
    }

    static obterUltimosLogs(quantidade: number): LogCalculo[] {
        return this.logs.slice(-quantidade);
    }

    static exportarLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }
}
