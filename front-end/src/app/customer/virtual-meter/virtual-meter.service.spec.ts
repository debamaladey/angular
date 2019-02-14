import { TestBed } from '@angular/core/testing';

import { VirtualMeterService } from './virtual-meter.service';

describe('VirtualMeterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VirtualMeterService = TestBed.get(VirtualMeterService);
    expect(service).toBeTruthy();
  });
});
