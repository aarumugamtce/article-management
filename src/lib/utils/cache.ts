// Cache TTL Configuration (in milliseconds)
export const CACHE_CONFIG = {
	DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
	API_TTL: 2 * 60 * 1000, // 2 minutes for API responses
	STATIC_TTL: 30 * 60 * 1000 // 30 minutes for static data
} as const;

interface CacheItem<T> {
	data: T;
	timestamp: number;
	ttl: number;
}

class SimpleCache<T> {
	private cache = new Map<string, CacheItem<T>>();

	set(key: string, data: T, ttl = CACHE_CONFIG.DEFAULT_TTL): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl
		});
	}

	get(key: string): T | null {
		const item = this.cache.get(key);
		if (!item) return null;

		if (Date.now() - item.timestamp > item.ttl) {
			this.cache.delete(key);
			return null;
		}

		return item.data;
	}

	clear = () => this.cache.clear();
	has = (key: string) => this.get(key) !== null;
}

export const apiCache = new SimpleCache();
