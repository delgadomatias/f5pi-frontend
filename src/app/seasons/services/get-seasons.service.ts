import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { BasePaginatedResourceService } from '@common/services/base-paginated-resource.service';
import { SeasonsResponse } from '@seasons/interfaces/responses/seasons-response.interface';
import { SeasonsService } from '@seasons/services/seasons.service';

@Injectable({ providedIn: 'root' })
export class GetSeasonsService extends BasePaginatedResourceService<SeasonsResponse> {
  private readonly seasonsService = inject(SeasonsService);
  seasons = computed(() => this.response()?.content || []);

  protected override getResourceStream(params: PaginatedRequest): Observable<SeasonsResponse> {
    return this.seasonsService.getSeasons(params);
  }
}
