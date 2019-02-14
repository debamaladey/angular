import { TestBed } from '@angular/core/testing';

import { TariffRuleService } from './tariff-rule.service';

describe('TariffRuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TariffRuleService = TestBed.get(TariffRuleService);
    expect(service).toBeTruthy();
  });
});
