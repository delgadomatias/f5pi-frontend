import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly EXCLUDED_BEARER_ROUTES = ['/auth'];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.getAccessToken();

    if (!accessToken) return next.handle(req);
    if (this.shouldExcludeBearerRoute(req.url)) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq);
  }

  private shouldExcludeBearerRoute(url: string): boolean {
    return this.EXCLUDED_BEARER_ROUTES.some((route) => url.includes(route));
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
