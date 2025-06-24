import { inject, Injectable, linkedSignal, signal } from '@angular/core';

import { FieldResponse } from '@fields/interfaces/responses/fields-response.interface';
import { FieldsService } from './fields.service';
import { GetFieldsService } from './get-fields.service';

@Injectable({ providedIn: 'root' })
export class GetInfiniteFieldsService {
  private readonly fieldsService = inject(FieldsService);
  private readonly pageNumber = signal<number>(0);
  private readonly pageSize = signal<number>(2);
  private readonly fieldsResponse = signal<FieldResponse[]>([]);
  private readonly getFieldsService = inject(GetFieldsService);
  fields = linkedSignal(() => this.fieldsResponse().flatMap((response) => response.content));

  constructor() {
    this.loadFields();
  }

  private loadFields() {
    const initialData = this.getFieldsService.response();
    if (initialData) {
      this.fieldsResponse.set([initialData]);
      if (initialData.last) return; // If the initial data is the last page, no need to fetch more.
    }

    this.fieldsService.getFields({ pageNumber: this.pageNumber(), pageSize: this.pageSize() }).subscribe({
      next: (response) => {
        const fieldsResponse = this.fieldsResponse();
        if (fieldsResponse) this.fieldsResponse.update((p) => [...p, response]);
        else this.fieldsResponse.set([response]);
      },
    });
  }

  fetchNextPage() {
    if (this.fieldsResponse()[this.fieldsResponse().length - 1]?.last) return;
    this.pageNumber.update((currentPage) => currentPage + 1);
    this.loadFields();
  }

  hasNextPage() {
    return !this.fieldsResponse()[this.fieldsResponse().length - 1]?.last;
  }
}
