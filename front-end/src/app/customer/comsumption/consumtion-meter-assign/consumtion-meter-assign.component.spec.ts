import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumtionMeterAssignComponent } from './consumtion-meter-assign.component';

describe('ConsumtionMeterAssignComponent', () => {
  let component: ConsumtionMeterAssignComponent;
  let fixture: ComponentFixture<ConsumtionMeterAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumtionMeterAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumtionMeterAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
