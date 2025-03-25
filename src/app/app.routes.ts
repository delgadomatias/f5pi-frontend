import { Routes } from '@angular/router';

import { redirectIfNotAuthenticatedGuard } from '@auth/guards/non-required-auth.guard';
import { redirectIfAuthenticatedGuard } from '@auth/guards/required-auth.guard';

export const routes: Routes = [
  {
    canActivate: [redirectIfNotAuthenticatedGuard],
    path: 'auth',
    loadComponent: () => import('@layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [redirectIfAuthenticatedGuard],
    loadComponent: () => import('@pages/home/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
];
