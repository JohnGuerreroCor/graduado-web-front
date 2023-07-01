import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistincionesReconocimientosComponent } from './distinciones-reconocimientos.component';

describe('DistincionesReconocimientosComponent', () => {
  let component: DistincionesReconocimientosComponent;
  let fixture: ComponentFixture<DistincionesReconocimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistincionesReconocimientosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistincionesReconocimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
