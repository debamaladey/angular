import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SadashboardComponent } from './sadashboard.component';

describe('SadashboardComponent', () => {
  let component: SadashboardComponent;
  let fixture: ComponentFixture<SadashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SadashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SadashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
