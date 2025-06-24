import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { ErrorStateMatcher, provideNativeDateAdapter, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { keepPreviousData, provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { authInterceptor } from '@auth/interceptors/auth.interceptor';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { LocalStorageService } from '@common/services/local-storage.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideTanStackQuery(new QueryClient({ defaultOptions: { queries: { placeholderData: keepPreviousData } } })),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideClientHydration(
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true, includePostRequests: true }),
      withIncrementalHydration()
    ),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { backdropClass: 'backdrop', enterAnimationDuration: '0ms', panelClass: 'dialog' },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
    { provide: ClientStorageService, useClass: LocalStorageService },
  ],
};
