import { TestBed } from '@angular/core/testing';

import { ResouceService } from './resouce.service';

describe('ResouceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResouceService = TestBed.get(ResouceService);
    expect(service).toBeTruthy();
  });
});
