type CacheType<T = unknown> = Record<string, T>;

class Cache {
  private cache: CacheType;

  constructor() {
    this.cache = {};
  }

  get<T>(key: string): T | undefined {
    return this.cache[key] as T;
  }

  set<T>(key: string, value: T): void {
    this.cache[key] = value;
  }

  clear(): void {
    this.cache = {};
  }
}

export const cache = new Cache();