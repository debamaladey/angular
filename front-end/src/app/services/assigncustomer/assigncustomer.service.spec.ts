import { TestBed } from '@angular/core/testing';

import { AssigncustomerService } from './assigncustomer.service';

describe('AssigncustomerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssigncustomerService = TestBed.get(AssigncustomerService);
    expect(service).toBeTruthy();
  });
});
