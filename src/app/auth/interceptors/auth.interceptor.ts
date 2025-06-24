import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _EXCLUDED_BEARER_ROUTES = ['/auth'];
  const cookieService = inject(SsrCookieService);

  if (shouldExcludeBearerRoute(req.url)) return next(req);

  const accessToken = cookieService.get('access_token');
  if (!accessToken) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  return next(authReq);

  function shouldExcludeBearerRoute(url: string): boolean {
    return _EXCLUDED_BEARER_ROUTES.some((route) => url.startsWith(route));
  }
};
