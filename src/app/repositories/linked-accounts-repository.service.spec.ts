import { TestBed } from '@angular/core/testing';

import { LinkedAccountsRepositoryService } from './linked-accounts-repository.service';

describe('LinkedAccountsRepositoryService', () => {
  let service: LinkedAccountsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkedAccountsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
