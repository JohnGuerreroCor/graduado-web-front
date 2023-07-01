import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfaccionFormacionComponent } from './satisfaccion-formacion.component';

describe('SatisfaccionFormacionComponent', () => {
  let component: SatisfaccionFormacionComponent;
  let fixture: ComponentFixture<SatisfaccionFormacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SatisfaccionFormacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SatisfaccionFormacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
