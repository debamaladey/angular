import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCustomerComponent } from './assign-customer.component';

describe('AssignCustomerComponent', () => {
  let component: AssignCustomerComponent;
  let fixture: ComponentFixture<AssignCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
