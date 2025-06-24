import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { map, skipWhile } from 'rxjs';

import { AuthStatus } from '@auth/interfaces/auth-status.enum';
import { AuthService } from '@auth/services/auth.service';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  return toObservable(authService.status).pipe(
    skipWhile((status) => status === AuthStatus.PENDING),
    map((status) => {
      if (status === AuthStatus.UNAUTHENTICATED) return true;
      return createUrlTreeFromSnapshot(route, ['/']);
    })
  );
};
