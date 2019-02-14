import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentalChargesComponent } from './environmental-charges.component';

describe('EnvironmentalChargesComponent', () => {
  let component: EnvironmentalChargesComponent;
  let fixture: ComponentFixture<EnvironmentalChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentalChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentalChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
