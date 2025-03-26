import { Injectable } from '@angular/core';

import { ClientStorageService } from '@common/client-storage.service.abstract';

@Injectable()
export class LocalStorageService implements ClientStorageService {
  private storage = localStorage;

  get<T>(key: string): T | null {
    const value = this.storage.getItem(key);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  set(key: string, value: unknown): void {
    const parsedValue = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(key, parsedValue);
  }
}
