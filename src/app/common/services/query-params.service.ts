import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly queryParams = toSignal(this.route.queryParams);

  clearQueryParams(): void {
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
  }

  pushQueryParams(params: Record<string, string | number | boolean>): void {
    this.router.navigate([], {
      queryParams: params,
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  removeQueryParams(params: string[]): void {
    const currentParams = this.route.snapshot.queryParams;
    const newParams = { ...currentParams };

    params.forEach((param) => {
      delete newParams[param];
    });

    this.router.navigate([], {
      queryParams: newParams,
      relativeTo: this.route,
    });
  }
}
