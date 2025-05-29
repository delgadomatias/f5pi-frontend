import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _EXCLUDED_BEARER_ROUTES = ['/auth'];
  private readonly _authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.shouldExcludeBearerRoute(req.url)) return next.handle(req);

    const accessToken = this._authService.accessToken();
    if (!accessToken) return next.handle(req);

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next.handle(authReq);
  }

  private shouldExcludeBearerRoute(url: string): boolean {
    return this._EXCLUDED_BEARER_ROUTES.some((route) => url.includes(route));
  }
}
