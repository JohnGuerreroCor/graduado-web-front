import { TestBed } from '@angular/core/testing';

import { SoporteExpedicionService } from './soporte-expedicion.service';

describe('SoporteExpedicionService', () => {
  let service: SoporteExpedicionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoporteExpedicionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
