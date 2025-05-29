import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _EXCLUDED_BEARER_ROUTES = ['/auth'];
  private readonly _clientStorageService = inject(ClientStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldExcludeBearerRoute(req.url)) return next.handle(req);

    const accessToken = this._clientStorageService.get<string>('accessToken');
    if (!accessToken) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq);
  }

  private shouldExcludeBearerRoute(url: string): boolean {
    return this._EXCLUDED_BEARER_ROUTES.some((route) => url.startsWith(route));
  }
}
