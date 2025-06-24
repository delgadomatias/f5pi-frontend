import { inject, Injectable } from '@angular/core';

import { LoginRequest } from '@auth/interfaces/requests/login-request.interface';
import { LoginResponse } from '@auth/interfaces/responses/login-response.interface';
import { AuthService } from '@auth/services/auth.service';
import { mutationPerformer } from '@common/services/mutation-performer.service';

@Injectable()
export class LoginService {
  private readonly authService = inject(AuthService);
  private readonly mutation = mutationPerformer<LoginResponse>();

  error = this.mutation.error;
  isPending = this.mutation.isPending;

  execute(credentials: LoginRequest) {
    return this.mutation.mutate(() => this.authService.login(credentials));
  }
}
