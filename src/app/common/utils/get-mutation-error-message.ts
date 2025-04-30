import { HttpErrorResponse } from '@angular/common/http';

export function getMutationErrorMessage(mutation: any): string {
  const hasError = mutation.isError();
  const isHttpError = mutation.error() instanceof HttpErrorResponse;
  if (hasError && isHttpError) return (mutation.error() as HttpErrorResponse).error.message || 'An unknown error occurred';
  if (hasError && !isHttpError) return mutation.error().message;
  return 'An unknown error occurred';
}
