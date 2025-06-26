import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideQueryClient, QueryClient } from '@tanstack/angular-query-experimental';
import { of } from 'rxjs';

import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { CreateFieldService } from '@fields/services/create-field.service';
import { GetFieldsService } from '@fields/services/get-fields.service';
import { NewFieldDialogComponent } from './new-field-dialog.component';

describe('NewFieldDialogComponent', () => {
  let component: NewFieldDialogComponent;
  let fixture: ComponentFixture<NewFieldDialogComponent>;
  let createFieldService: jasmine.SpyObj<CreateFieldService>;
  let clientStorageService: jasmine.SpyObj<ClientStorageService>;
  let getFieldsService: jasmine.SpyObj<GetFieldsService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any, any>>;

  beforeEach(async () => {
    const createFieldServiceSpy = jasmine.createSpyObj('CreateFieldService', ['execute']);
    const clientStorageServiceSpy = jasmine.createSpyObj('ClientStorageService', ['get', 'set', 'remove']);
    const getFieldsServiceSpy = jasmine.createSpyObj('GetFieldsService', ['execute']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close'], { disableClose: false });

    // Setup default return values
    createFieldServiceSpy.execute.and.returnValue(of({}));
    clientStorageServiceSpy.get.and.returnValue(null);

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideQueryClient(new QueryClient()),
        { provide: ClientStorageService, useValue: clientStorageServiceSpy },
        { provide: CreateFieldService, useValue: createFieldServiceSpy },
        { provide: GetFieldsService, useValue: getFieldsServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewFieldDialogComponent);
    fixture.autoDetectChanges();
    component = fixture.componentInstance;

    createFieldService = TestBed.inject(CreateFieldService) as jasmine.SpyObj<CreateFieldService>;
    clientStorageService = TestBed.inject(ClientStorageService) as jasmine.SpyObj<ClientStorageService>;
    getFieldsService = TestBed.inject(GetFieldsService) as jasmine.SpyObj<GetFieldsService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<any, any>>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values from storage on init', () => {
    const savedData = { name: 'Test Field' };
    clientStorageService.get.and.returnValue(savedData);

    component.ngOnInit();

    expect(component.form.get('name')?.value).toBe('Test Field');
    expect(clientStorageService.get).toHaveBeenCalledWith('new-field-form');
  });

  it('should mark name as invalid when exceeding max length', () => {
    const longName = 'a'.repeat(21);
    component.form.get('name')?.setValue(longName);

    expect(component.form.get('name')?.hasError('maxlength')).toBeTruthy();
  });
});
