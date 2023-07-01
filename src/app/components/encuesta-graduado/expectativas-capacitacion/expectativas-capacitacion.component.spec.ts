import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectativasCapacitacionComponent } from './expectativas-capacitacion.component';

describe('ExpectativasCapacitacionComponent', () => {
  let component: ExpectativasCapacitacionComponent;
  let fixture: ComponentFixture<ExpectativasCapacitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpectativasCapacitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpectativasCapacitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
