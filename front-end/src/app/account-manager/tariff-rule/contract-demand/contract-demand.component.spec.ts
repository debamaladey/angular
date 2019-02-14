import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDemandComponent } from './contract-demand.component';

describe('ContractDemandComponent', () => {
  let component: ContractDemandComponent;
  let fixture: ComponentFixture<ContractDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
