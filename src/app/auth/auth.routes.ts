import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () => import('@pages/auth/login-page/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('@pages/auth/register-page/register-page.component').then((c) => c.RegisterPageComponent),
  },
  {
    path: '**',
    redirectTo: 'sign-in',
  },
];
