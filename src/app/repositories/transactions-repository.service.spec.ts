import { TestBed } from '@angular/core/testing';

import { TransactionsRepositoryService } from './transactions-repository.service';

describe('TransactionsRepositoryService', () => {
  let service: TransactionsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
