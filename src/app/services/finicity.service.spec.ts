import { TestBed } from '@angular/core/testing';

import { FinicityService } from './finicity.service';

describe('FinicityService', () => {
  let service: FinicityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinicityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
