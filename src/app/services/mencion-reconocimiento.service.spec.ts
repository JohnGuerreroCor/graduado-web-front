import { TestBed } from '@angular/core/testing';

import { MencionReconocimientoService } from './mencion-reconocimiento.service';

describe('MencionReconocimientoService', () => {
  let service: MencionReconocimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MencionReconocimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
