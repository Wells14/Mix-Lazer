import { CacheConfig } from '../types/calculos';

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, { value: any; timestamp: number }>;
  private config: CacheConfig = {
    ttl: 300, // 5 minutos
    maxSize: 1000
  };

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  setConfig(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  set(key: string, value: any): void {
    // Limpa entradas expiradas antes de adicionar nova
    this.clearExpired();

    // Verifica se atingiu o tamanho máximo
    if (this.cache.size >= this.config.maxSize) {
      // Remove a entrada mais antiga
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;

    // Verifica se o valor expirou
    if (this.isExpired(entry.timestamp)) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  private isExpired(timestamp: number): boolean {
    const now = Date.now();
    const age = now - timestamp;
    return age > this.config.ttl * 1000;
  }

  private clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry.timestamp)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Gera uma chave única baseada nos parâmetros
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
}
