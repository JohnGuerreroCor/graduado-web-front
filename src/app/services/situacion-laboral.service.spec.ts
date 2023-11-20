import { TestBed } from '@angular/core/testing';

import { SituacionLaboralService } from './situacion-laboral.service';

describe('SituacionLaboralService', () => {
  let service: SituacionLaboralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituacionLaboralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
