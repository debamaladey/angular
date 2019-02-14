import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodZoneAddEditComponent } from './tod-zone-add-edit.component';

describe('TodZoneAddEditComponent', () => {
  let component: TodZoneAddEditComponent;
  let fixture: ComponentFixture<TodZoneAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodZoneAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodZoneAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
