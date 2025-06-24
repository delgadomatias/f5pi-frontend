import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { map, skipWhile } from 'rxjs';

import { AUTH_CONSTANTS } from '@auth/auth.constants';
import { AuthStatus } from '@auth/interfaces/auth-status.enum';
import { AuthService } from '@auth/services/auth.service';

export const redirectIfNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const cookieService = inject(SsrCookieService);
  return toObservable(authService.status).pipe(
    skipWhile((status) => status === AuthStatus.PENDING),
    map((status) => {
      if (status === AuthStatus.AUTHENTICATED) return true;
      cookieService.set(AUTH_CONSTANTS.PREVIOUS_ROUTE_STORAGE_NAME, state.url, { expires: 1 });
      return createUrlTreeFromSnapshot(route, ['/auth/sign-in']);
    })
  );
};
