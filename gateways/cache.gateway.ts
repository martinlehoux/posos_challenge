export interface CacheGateway<T> {
  get(): Promise<GetCachePayload<T>>;
  set(data: T): Promise<void>;
}

export type GetCachePayload<T> = {
  expired: boolean;
  data: T | null;
};
