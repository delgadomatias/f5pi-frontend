import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoginRequest } from '@auth/interfaces/login-request.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule],
  selector: 'f5pi-login-form',
  styleUrl: './login-form.component.css',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  onSubmit = output<LoginRequest>();
  isLoading = input<boolean>(false);
  formBuilder = inject(NonNullableFormBuilder);
  hidePassword = signal<boolean>(true);
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    const credentials = this.loginForm.getRawValue();
    this.onSubmit.emit(credentials);
  }

  handleTogglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }
}
