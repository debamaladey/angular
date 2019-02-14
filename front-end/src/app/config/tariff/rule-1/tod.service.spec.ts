import { TestBed } from '@angular/core/testing';

import { TodService } from './tod.service';

describe('TodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TodService = TestBed.get(TodService);
    expect(service).toBeTruthy();
  });
});
