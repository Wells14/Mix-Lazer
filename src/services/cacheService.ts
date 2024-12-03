export class CacheService {
    private static cache = new Map<string, {
        value: number;
        timestamp: number;
        expiresIn: number;
    }>();

    private static readonly DEFAULT_EXPIRATION = 1000 * 60 * 5; // 5 minutos

    static getCached(key: string): number | undefined {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return undefined;
        }

        if (Date.now() > cached.timestamp + cached.expiresIn) {
            this.cache.delete(key);
            return undefined;
        }

        return cached.value;
    }

    static setCached(key: string, value: number, expiresIn: number = this.DEFAULT_EXPIRATION): void {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            expiresIn
        });
    }

    static clearCache(): void {
        this.cache.clear();
    }

    static removeExpired(): void {
        const now = Date.now();
        for (const [key, cached] of this.cache.entries()) {
            if (now > cached.timestamp + cached.expiresIn) {
                this.cache.delete(key);
            }
        }
    }

    static generateKey(method: string, params: Record<string, any>): string {
        return `${method}:${JSON.stringify(params)}`;
    }
}
