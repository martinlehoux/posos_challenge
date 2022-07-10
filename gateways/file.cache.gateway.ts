import fs from "node:fs/promises";

import { CacheGateway, GetCachePayload } from "./cache.gateway";

export class FileCacheGateway<T> implements CacheGateway<T> {
  constructor(private cacheFilePath: string, private cacheDuration: number) {}

  async get(): Promise<GetCachePayload<T>> {
    try {
      await fs.access(this.cacheFilePath);
    } catch {
      return {
        expired: false,
        data: null,
      };
    }

    const [stat, buffer] = await Promise.all([
      fs.stat(this.cacheFilePath),
      fs.readFile(this.cacheFilePath),
    ]);

    const expiration = stat.mtime;
    expiration.setSeconds(expiration.getSeconds() + this.cacheDuration);

    return {
      expired: new Date() > expiration,
      data: JSON.parse(buffer.toString()),
    };
  }

  async set(data: T): Promise<void> {
    await fs.writeFile(this.cacheFilePath, JSON.stringify(data));
  }
}
