export abstract class ClientStorageService {
  abstract get<T>(key: string): T | null;
  abstract remove(key: string): void;
  abstract set(key: string, value: unknown): void;
}
