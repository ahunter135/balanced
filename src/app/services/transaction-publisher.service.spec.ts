import { TestBed } from '@angular/core/testing';

import { TransactionPublisherService } from './transaction-publisher.service';

describe('TransactionPublisherService', () => {
  let service: TransactionPublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionPublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
