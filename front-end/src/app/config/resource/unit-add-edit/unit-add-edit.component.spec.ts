import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitAddEditComponent } from './unit-add-edit.component';

describe('UnitAddEditComponent', () => {
  let component: UnitAddEditComponent;
  let fixture: ComponentFixture<UnitAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
