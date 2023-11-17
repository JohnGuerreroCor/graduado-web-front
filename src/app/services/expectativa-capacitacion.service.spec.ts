import { TestBed } from '@angular/core/testing';

import { ExpectativaCapacitacionService } from './expectativa-capacitacion.service';

describe('ExpectativaCapacitacionService', () => {
  let service: ExpectativaCapacitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpectativaCapacitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
