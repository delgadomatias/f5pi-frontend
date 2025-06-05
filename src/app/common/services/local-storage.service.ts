import { isPlatformServer } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { ClientStorageService } from '@common/services/client-storage.service.abstract';

@Injectable()
export class LocalStorageService implements ClientStorageService {
  private readonly isRunningOnServer = isPlatformServer(inject(PLATFORM_ID));
  private storage = this.isRunningOnServer
    ? {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }
    : window.localStorage;

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
