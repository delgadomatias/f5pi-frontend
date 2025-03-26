import { Routes } from '@angular/router';

import { redirectIfAuthenticatedGuard } from '@auth/guards/non-required-auth.guard';
import { redirectIfNotAuthenticatedGuard } from '@auth/guards/required-auth.guard';
import { AppLayoutComponent } from '@layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    canActivate: [redirectIfAuthenticatedGuard],
    path: 'auth',
    loadComponent: () => import('@layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('@auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [redirectIfNotAuthenticatedGuard],
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('@pages/home/home-page/home-page.component').then((m) => m.HomePageComponent),
      },
      {
        path: 'players',
        loadComponent: () =>
          import('@pages/home/players-page/players-page.component').then((m) => m.PlayersPageComponent),
      },
      {
        path: 'fields',
        loadComponent: () => import('@pages/home/fields-page/fields-page.component').then((m) => m.FieldsPageComponent),
      },
    ],
  },
];
