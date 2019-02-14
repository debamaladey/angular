import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodZoneListComponent } from './tod-zone-list.component';

describe('TodZoneListComponent', () => {
  let component: TodZoneListComponent;
  let fixture: ComponentFixture<TodZoneListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodZoneListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodZoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
