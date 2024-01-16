import { TestBed } from '@angular/core/testing';

import { CategoryRepositoryService } from './category-repository.service';

describe('CategoryRepositoryService', () => {
  let service: CategoryRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
