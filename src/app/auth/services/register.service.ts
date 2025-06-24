import { inject, Injectable } from '@angular/core';

import { CreateUserRequest } from '@auth/interfaces/requests/create-user-request.interface';
import { AuthService } from '@auth/services/auth.service';
import { mutationPerformer } from '@common/services/mutation-performer.service';

@Injectable()
export class RegisterService {
  private readonly authService = inject(AuthService);
  private readonly mutation = mutationPerformer<void>();

  error = this.mutation.error;
  isPending = this.mutation.isPending;

  execute(credentials: CreateUserRequest) {
    return this.mutation.mutate(() => this.authService.register(credentials));
  }
}
