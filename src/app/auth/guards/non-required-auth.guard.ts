import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { map, skipWhile } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { AuthStatus } from '@auth/interfaces/auth-status.enum';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return toObservable(authService.status).pipe(
    skipWhile((status) => status === AuthStatus.PENDING),
    map((status) => {
      if (status === AuthStatus.UNAUTHENTICATED) return true;
      return createUrlTreeFromSnapshot(route, ['/']);
    })
  );
};
