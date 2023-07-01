import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaGraduadoComponent } from './encuesta-graduado.component';

describe('EncuestaGraduadoComponent', () => {
  let component: EncuestaGraduadoComponent;
  let fixture: ComponentFixture<EncuestaGraduadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncuestaGraduadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncuestaGraduadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
