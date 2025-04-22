import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/auth.service';

@Component({
  selector: 'f5pi-register-page',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  readonly authService = inject(AuthService);
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly router = inject(Router);
  readonly snackBar = inject(MatSnackBar);
  hidePassword = signal<boolean>(true);
  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required]],
  })

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.authService.registerMutation.mutate(this.form.getRawValue(), {
      onSuccess: () => {
        this.snackBar.open('Account created', undefined, { duration: 400, panelClass: 'auth-snackbar' })
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login', { replaceUrl: true })
        }, 800);
      }
    })
  }

  handleTogglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
