import { TestBed } from '@angular/core/testing';

import { SubcategoryRepositoryService } from './subcategory-repository.service';

describe('SubcategoryRepositoryService', () => {
  let service: SubcategoryRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubcategoryRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
