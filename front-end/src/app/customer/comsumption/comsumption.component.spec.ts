import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComsumptionComponent } from './comsumption.component';

describe('ComsumptionComponent', () => {
  let component: ComsumptionComponent;
  let fixture: ComponentFixture<ComsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
