import { CacheConfig } from '../types/calculos';

export interface CacheConfig {
  maxSize?: number;
  prefix: string;
}

export class CacheService {
  private static cache = new Map<string, any>();
  private static config: CacheConfig = {
    maxSize: 1000,
    prefix: 'cache_'
  };

  static generateKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  static setCached<T>(key: string, value: T): void {
    const cacheKey = this.generateKey(key);
    this.cache.set(cacheKey, value);

    // Limitar tamanho do cache
    if (this.config.maxSize && this.cache.size > this.config.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  static getCached<T>(key: string): T | null {
    const cacheKey = this.generateKey(key);
    return this.cache.get(cacheKey) || null;
  }

  static removeCached(key: string): void {
    const cacheKey = this.generateKey(key);
    this.cache.delete(cacheKey);
  }

  static getAllWithPrefix<T>(prefix: string): T[] {
    const results: T[] = [];
    const searchPrefix = this.generateKey(prefix);
    
    for (const [key, value] of this.cache.entries()) {
      if (key.startsWith(searchPrefix)) {
        results.push(value);
      }
    }
    
    return results;
  }
}
