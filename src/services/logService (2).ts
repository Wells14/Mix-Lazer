import { LogCalculo } from '../types/calculos';
import { v4 as uuidv4 } from 'uuid';

export class LogService {
  private static instance: LogService;
  private logs: LogCalculo[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  registrarCalculo(tipo: string, valores: Record<string, number>, resultado: number): void {
    const log: LogCalculo = {
      id: uuidv4(),
      timestamp: new Date(),
      tipo,
      valores,
      resultado
    };

    this.logs.unshift(log);

    // Mantém apenas os últimos maxLogs registros
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  obterLogs(filtros?: {
    tipo?: string;
    dataInicio?: Date;
    dataFim?: Date;
  }): LogCalculo[] {
    let logsFiltered = [...this.logs];

    if (filtros?.tipo) {
      logsFiltered = logsFiltered.filter(log => log.tipo === filtros.tipo);
    }

    if (filtros?.dataInicio) {
      logsFiltered = logsFiltered.filter(log => 
        log.timestamp >= filtros.dataInicio!
      );
    }

    if (filtros?.dataFim) {
      logsFiltered = logsFiltered.filter(log => 
        log.timestamp <= filtros.dataFim!
      );
    }

    return logsFiltered;
  }

  limparLogs(): void {
    this.logs = [];
  }

  exportarLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
