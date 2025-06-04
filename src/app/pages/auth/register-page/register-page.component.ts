import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { RECENTLY_CREATED_ACCOUNT_COOKIE_NAME } from '@auth/auth.constants';
import { AuthService } from '@auth/auth.service';
import { injectRegisterMutation } from '@auth/queries/inject-register-mutation';
import { AlertComponent } from '@common/components/alert/alert.component';
import { CookieService } from '@common/services/cookie.service';

@Component({
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AlertComponent,
  ],
  providers: [CookieService],
  selector: 'f5pi-register-page',
  styleUrl: './register-page.component.css',
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  readonly authService = inject(AuthService);
  readonly cookieService = inject(CookieService);
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar);
  readonly titleService = inject(Title);
  readonly registerMutation = injectRegisterMutation();

  hidePassword = signal<boolean>(true);
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required]],
  });

  constructor() {
    this.titleService.setTitle('Step Into The Stats | f5pi');
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const credentials = this.form.getRawValue();
    this.registerMutation.mutate(credentials, {
      onSuccess: () => {
        this.cookieService.set(RECENTLY_CREATED_ACCOUNT_COOKIE_NAME, 'true');
        this.router.navigateByUrl('/auth/sign-in', { replaceUrl: true });
      },
    });
  }

  handleTogglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
