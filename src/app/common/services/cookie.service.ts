import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';

@Injectable()
export class CookieService {
  private readonly document = inject(DOCUMENT);
  private readonly documentIsAccessible = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly request = inject(REQUEST);
  private readonly equals = '=';
  private readonly separator = '; ';

  set(name: string, value: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
    const expiresString = `expires=${expires.toUTCString()}`;
    document.cookie = `${name}${this.equals}${value}; ${expiresString}; path=/`;
  }

  delete(name: string): void {
    const expires = new Date(0);
    const expiresString = `expires=${expires.toUTCString()}`;
    document.cookie = `${name}${this.equals}; ${expiresString}; path=/`;
  }
}
