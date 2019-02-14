import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargesVariableConfigComponent } from './charges-variable-config.component';

describe('ChargesVariableConfigComponent', () => {
  let component: ChargesVariableConfigComponent;
  let fixture: ComponentFixture<ChargesVariableConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargesVariableConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargesVariableConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
