type CacheItem<T> = {
  data: T;
  timestamp: number;
  size: number;
};

class QueryCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private readonly TTL: number = 5 * 60 * 1000; // 5 minutes default TTL
  private readonly MAX_CACHE_SIZE: number = 100 * 1024 * 1024; // 100MB max cache size
  private currentSize: number = 0;

  private calculateSize(data: any): number {
    const str = JSON.stringify(data);
    return new TextEncoder().encode(str).length;
  }

  private prune(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove expired entries and free up space
    for (const [key, item] of entries) {
      if (now > item.timestamp || this.currentSize > this.MAX_CACHE_SIZE) {
        this.cache.delete(key);
        this.currentSize -= item.size;
      } else {
        break;
      }
    }
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove old entry if exists
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!;
      this.currentSize -= oldItem.size;
    }

    const size = this.calculateSize(data);
    
    // If single item is too large, don't cache it
    if (size > this.MAX_CACHE_SIZE * 0.1) { // Don't cache items larger than 10% of max size
      return;
    }

    // Prune cache if necessary
    if (this.currentSize + size > this.MAX_CACHE_SIZE) {
      this.prune();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.TTL),
      size
    });
    
    this.currentSize += size;
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      this.currentSize -= item.size;
      return null;
    }

    // Update timestamp to implement LRU
    item.timestamp = Date.now() + this.TTL;
    return item.data as T;
  }

  invalidate(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  getStats(): { size: number; entries: number } {
    return {
      size: this.currentSize,
      entries: this.cache.size
    };
  }
}

export const queryCache = new QueryCache();