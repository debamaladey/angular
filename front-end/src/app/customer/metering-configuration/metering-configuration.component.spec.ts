import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteringConfigurationComponent } from './metering-configuration.component';

describe('MeteringConfigurationComponent', () => {
  let component: MeteringConfigurationComponent;
  let fixture: ComponentFixture<MeteringConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeteringConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeteringConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
