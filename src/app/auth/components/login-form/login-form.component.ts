import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AUTH_CONSTANTS } from '@auth/auth.constants';
import { injectLoginMutation } from '@auth/queries/inject-login-mutation';
import { AlertComponent } from '@common/components/alert/alert.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  selector: 'f5pi-login-form',
  styleUrl: './login-form.component.css',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  cookieService = inject(SsrCookieService);
  formBuilder = inject(NonNullableFormBuilder);
  router = inject(Router);
  loginMutation = injectLoginMutation();

  recentlyCreatedAccount = signal<boolean>(false);
  hidePassword = signal<boolean>(true);
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', [Validators.required]],
  });

  ngOnInit() {
    this.checkRecentlyCreatedAccount();
  }

  handleSubmit() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    const credentials = this.loginForm.getRawValue();
    this.loginMutation.mutate(credentials, {
      onSuccess: () => this.router.navigateByUrl('/', { replaceUrl: true }),
      onSettled: () => this.recentlyCreatedAccount.set(false),
    });
  }

  handleTogglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  private checkRecentlyCreatedAccount() {
    const cookie = this.cookieService.get(AUTH_CONSTANTS.RECENTLY_CREATED_ACCOUNT_STORAGE_NAME);
    if (!cookie) return;

    this.cookieService.delete(AUTH_CONSTANTS.RECENTLY_CREATED_ACCOUNT_STORAGE_NAME);
    this.recentlyCreatedAccount.set(true);
  }
}
