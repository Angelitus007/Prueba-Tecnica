import { TestBed } from '@angular/core/testing';

import { AlertMsgService } from './alert-msg.service';

describe('AlertMsgService', () => {
  let service: AlertMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
