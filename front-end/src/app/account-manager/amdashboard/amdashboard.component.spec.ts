import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmdashboardComponent } from './amdashboard.component';

describe('AmdashboardComponent', () => {
  let component: AmdashboardComponent;
  let fixture: ComponentFixture<AmdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
