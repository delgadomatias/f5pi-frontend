import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { LoginFormComponent } from '@auth/components/login-form/login-form.component';

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

  constructor() {
    this.titleService.setTitle('Sign In — F5pi');
  }
}
