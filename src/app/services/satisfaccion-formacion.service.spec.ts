import { TestBed } from '@angular/core/testing';

import { SatisfaccionFormacionService } from './satisfaccion-formacion.service';

describe('SatisfaccionFormacionService', () => {
  let service: SatisfaccionFormacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatisfaccionFormacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
