import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';
import { LoginFormComponent } from '@auth/components/login-form/login-form.component';
import { LoginRequest } from '@auth/interfaces/login-request.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoginFormComponent],
  providers: [MatSnackBar],
  selector: 'f5pi-login-page',
  styleUrl: './login-page.component.css',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  titleService = inject(Title);
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  isLoading = signal<boolean>(false);

  constructor() {
    this.titleService.setTitle('Login •  f5pi');
  }

  onSubmit(credentials: LoginRequest) {
    this.isLoading.set(true);

    const { username, password } = credentials;
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Logged in successfully', undefined, { duration: 400, panelClass: 'auth-snackbar' });
        setTimeout(() => this.router.navigateByUrl('/', { replaceUrl: true }), 800);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open(error.error.message ?? 'An unknown error ocurred.', 'Close', {
          panelClass: 'auth-snackbar',
        });
      },
    });
  }
}
