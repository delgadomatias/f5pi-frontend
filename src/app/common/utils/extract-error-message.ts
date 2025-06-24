import { HttpErrorResponse } from '@angular/common/http';

import { DEFAULT_ERROR_MESSAGE } from '@common/common.constants';

/**
 * Extracts a user-friendly error message from an Error object.
 *
 * @param error - The error object to extract the message from
 * @returns A string containing the error message. For HttpErrorResponse objects,
 *          returns the nested error message if available, otherwise falls back to
 *          the default error message. For other Error types, returns the message
 *          property or the default error message if not available.
 */
export function extractErrorMessage(error: Error): string {
  if (error instanceof HttpErrorResponse) return error.error?.message || DEFAULT_ERROR_MESSAGE;
  return error.message || DEFAULT_ERROR_MESSAGE;
}
