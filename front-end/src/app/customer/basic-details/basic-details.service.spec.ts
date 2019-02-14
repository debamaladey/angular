import { TestBed } from '@angular/core/testing';

import { BasicDetailsService } from './basic-details.service';

describe('BasicDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicDetailsService = TestBed.get(BasicDetailsService);
    expect(service).toBeTruthy();
  });
});
