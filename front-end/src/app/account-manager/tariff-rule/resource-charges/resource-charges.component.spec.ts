import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceChargesComponent } from './resource-charges.component';

describe('ResourceChargesComponent', () => {
  let component: ResourceChargesComponent;
  let fixture: ComponentFixture<ResourceChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
