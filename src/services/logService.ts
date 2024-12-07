import { LogCalculo } from '@/types/calculos';

export class LogService {
  private static logs: LogCalculo[] = [];

  static log(data: LogCalculo): void {
    const logEntry = {
      ...data,
      timestamp: new Date().toISOString()
    };
    this.logs.push(logEntry);
  }

  static getLogs(): LogCalculo[] {
    return this.logs.sort((a, b) => {
      const timestampA = a.timestamp || '';
      const timestampB = b.timestamp || '';
      return timestampB.localeCompare(timestampA);
    });
  }

  static clear(): void {
    this.logs = [];
  }
}
