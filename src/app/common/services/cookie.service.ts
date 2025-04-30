import { Injectable } from "@angular/core";

@Injectable()
export class CookieService {
  private readonly equals = "=";
  private readonly separator = "; ";
  private readonly store = document.cookie;

  get(name: string): string | null {
    return this.store.split(this.separator)
      .find(cookie => cookie.startsWith(name + this.equals))
      ?.split(this.equals)[1] || null;
  }

  set(name: string, value: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    const expiresString = `expires=${expires.toUTCString()}`;
    document.cookie = `${name}${this.equals}${value}; ${expiresString}; path=/`;
  }

  delete(name: string): void {
    const expires = new Date(0);
    const expiresString = `expires=${expires.toUTCString()}`;
    document.cookie = `${name}${this.equals}; ${expiresString}; path=/`;
  }
}