import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AUTH_CONSTANTS } from '@auth/auth.constants';
import { LoginService } from '@auth/services/login.service';
import { AlertComponent } from '@common/components/alert/alert.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-login-form',
  styleUrl: './login-form.component.css',
  templateUrl: './login-form.component.html',
  providers: [LoginService],
})
export class LoginFormComponent implements OnInit {
  private readonly cookieService = inject(SsrCookieService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  readonly loginService = inject(LoginService);

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
    this.loginService.execute(credentials).subscribe({
      next: () => {
        const navigateTo = this.cookieService.get(AUTH_CONSTANTS.PREVIOUS_ROUTE_STORAGE_NAME) || '/';
        this.cookieService.delete(AUTH_CONSTANTS.PREVIOUS_ROUTE_STORAGE_NAME);
        this.router.navigateByUrl(navigateTo, { replaceUrl: true });
      },
      complete: () => this.recentlyCreatedAccount.set(false),
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
