import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AUTH_CONSTANTS } from '@auth/auth.constants';
import { injectRegisterMutation } from '@auth/queries/inject-register-mutation';
import { AlertComponent } from '@common/components/alert/alert.component';
import { HideElementOnServerDirective } from '@common/directives/pause-animation-on-server.directive';

@Component({
  imports: [
    AlertComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
    HideElementOnServerDirective,
  ],
  selector: 'f5pi-register-page',
  styleUrl: './register-page.component.css',
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private readonly cookieService = inject(SsrCookieService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  readonly registerMutation = injectRegisterMutation();

  hidePassword = signal<boolean>(true);
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required]],
  });

  constructor() {
    this.titleService.setTitle('Sign Up — F5pi');
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const credentials = this.form.getRawValue();
    this.registerMutation.mutate(credentials, {
      onSuccess: () => {
        this.cookieService.set(AUTH_CONSTANTS.RECENTLY_CREATED_ACCOUNT_STORAGE_NAME, 'true', { expires: 1 });
        this.router.navigateByUrl('/auth/sign-in', { replaceUrl: true });
      },
    });
  }

  handleTogglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
