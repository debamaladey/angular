import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedChargesComponent } from './fixed-charges.component';

describe('FixedChargesComponent', () => {
  let component: FixedChargesComponent;
  let fixture: ComponentFixture<FixedChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
