import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { AuthService } from "@auth/auth.service";
import { LoginRequest } from "@auth/interfaces/login-request.interface";
import { getMutationErrorMessage } from "@common/utils/get-mutation-error-message";

export function injectLoginMutation() {
  const authService = inject(AuthService);
  const mutation = injectMutation(() => ({
    mutationFn: (credentials: LoginRequest) => lastValueFrom(authService.login(credentials))
  }));
  return {
    ...mutation,
    getErrorMessage: () => getMutationErrorMessage(mutation)
  };
}