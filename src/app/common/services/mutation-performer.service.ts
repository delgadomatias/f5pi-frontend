import { HttpErrorResponse } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { DEFAULT_ERROR_MESSAGE } from '@common/common.constants';

interface MutationState {
  isPending: boolean;
  error: string | null;
}

const INITIAL_STATE: MutationState = {
  isPending: false,
  error: null,
};

export function mutationPerformer<T>() {
  const state = signal<MutationState>(INITIAL_STATE);

  const isPending = computed(() => state().isPending);
  const error = computed(() => state().error);

  function mutate(sourceFn: () => Observable<T>) {
    state.set({ ...state(), isPending: true, error: null });

    return new Observable<T>((subscriber) => {
      const subscription = sourceFn().subscribe({
        next: (value) => {
          subscriber.next(value);
          state.set({ ...state(), isPending: false });
        },
        error: (err) => {
          let errorMessage = DEFAULT_ERROR_MESSAGE;
          if (err instanceof Error) errorMessage = err.message;
          if (err instanceof HttpErrorResponse) errorMessage = err.error?.message || err.message;
          state.set({ ...state(), isPending: false, error: errorMessage });
          subscriber.error(errorMessage);
        },
        complete: () => {
          state.set({ ...state(), isPending: false });
          subscriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
  }

  return {
    error,
    isPending,
    mutate,
  };
}
