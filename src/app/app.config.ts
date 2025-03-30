import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter } from '@angular/router';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { LocalStorageService } from '@common/services/local-storage.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { backdropClass: 'backdrop', enterAnimationDuration: '0ms', panelClass: 'dialog' },
    },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
    { provide: ClientStorageService, useClass: LocalStorageService },
  ],
};
