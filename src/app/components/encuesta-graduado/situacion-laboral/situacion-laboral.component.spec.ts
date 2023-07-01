import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacionLaboralComponent } from './situacion-laboral.component';

describe('SituacionLaboralComponent', () => {
  let component: SituacionLaboralComponent;
  let fixture: ComponentFixture<SituacionLaboralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacionLaboralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituacionLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
