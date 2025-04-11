import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MutationsErrorHandlerService {
  getMutationErrorMessage(mutation: any): string | null {
    const hasError = mutation.isError();
    const isHttpError = mutation.error() instanceof HttpErrorResponse;

    if (hasError && isHttpError) {
      const error = mutation.error() as HttpErrorResponse;
      return error.error.message;
    }

    if (hasError && !isHttpError) {
      return mutation.error();
    }

    return null;
  }
}
