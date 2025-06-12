import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { ErrorStateMatcher, provideNativeDateAdapter, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { keepPreviousData, provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { AuthInterceptor } from '@common/interceptors/auth.interceptor';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { LocalStorageService } from '@common/services/local-storage.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            placeholderData: keepPreviousData,
            staleTime: Infinity,
          },
        },
      })
    ),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { backdropClass: 'backdrop', enterAnimationDuration: '0ms', panelClass: 'dialog' },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
    { provide: ClientStorageService, useClass: LocalStorageService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideClientHydration(withEventReplay()),
  ],
};
