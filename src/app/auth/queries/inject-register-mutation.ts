import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { AuthService } from "@auth/auth.service";
import { CreateUserRequest } from "@auth/interfaces/create-user-request.interface";
import { getMutationErrorMessage } from "@common/utils/get-mutation-error-message";

export function injectRegisterMutation() {
  const authService = inject(AuthService);
  const mutation = injectMutation(() => ({
    mutationFn: (credentials: CreateUserRequest) => lastValueFrom(authService.register(credentials)),
  }));
  return {
    ...mutation,
    getErrorMessage: () => getMutationErrorMessage(mutation)
  };
}