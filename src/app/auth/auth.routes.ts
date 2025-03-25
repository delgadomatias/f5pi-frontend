import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@pages/auth/login-page/login-page.component').then((c) => c.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@pages/auth/register-page/register-page.component').then((c) => c.RegisterPageComponent),
  },
];
