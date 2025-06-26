import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { Field } from '@fields/interfaces/responses/field.interface';
import { FieldResponse } from '@fields/interfaces/responses/fields-response.interface';
import { FieldsService } from '@fields/services/fields.service';

describe('Fields Service', () => {
  let fieldsService: FieldsService;

  beforeEach(() => {
    const providers = [provideZonelessChangeDetection(), provideHttpClient()];
    TestBed.configureTestingModule({ providers: [FieldsService, ...providers] });
    fieldsService = TestBed.inject(FieldsService);
  });

  it('Should be created', () => {
    expect(fieldsService).toBeDefined();
  });

  it('Should return a FieldResponse object when getFields is called', (done) => {
    // Mocking necessary services and methods
    const mockedFields = [{ fieldId: 'test-field-id', fieldName: 'Test Field' }] as Field[];
    const getFieldsSpy = spyOn(fieldsService, 'getFields');
    getFieldsSpy.and.returnValue(of({ content: mockedFields, totalElements: 1 } as FieldResponse));

    fieldsService.getFields({}).subscribe({
      next: (response) => {
        expect(response).toBeDefined();
        expect(response.content).toBeDefined();
        expect(response.totalElements).toBe(1);
        expect(response.content).toEqual(mockedFields);
        done();
      },
    });
  });

  it('Should handle empty fields response', (done) => {
    // Mocking necessary services and methods
    const getFieldsSpy = spyOn(fieldsService, 'getFields');
    getFieldsSpy.and.returnValue(of({ content: [] as Field[], totalElements: 0 } as FieldResponse));

    fieldsService.getFields({}).subscribe({
      next: (response) => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
        done();
      },
    });
  });

  it('Should pass query parameters correctly', (done) => {
    const queryParams = { pageNumber: 1, pageSize: 20 } as PaginatedRequest;
    const mockedFields = [{ fieldId: 'test-field-id', fieldName: 'Test Field' }] as Field[];
    const getFieldsSpy = spyOn(fieldsService, 'getFields');
    getFieldsSpy.and.returnValue(of({ content: mockedFields, totalElements: 1 } as FieldResponse));

    fieldsService.getFields(queryParams).subscribe({
      next: (response) => {
        expect(getFieldsSpy).toHaveBeenCalledWith(queryParams);
        expect(response.content).toEqual(mockedFields);
        done();
      },
    });
  });
});
