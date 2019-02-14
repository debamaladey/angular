import { TestBed } from '@angular/core/testing';

import { MsgDialogService } from './msg-dialog.service';

describe('MsgDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsgDialogService = TestBed.get(MsgDialogService);
    expect(service).toBeTruthy();
  });
});
