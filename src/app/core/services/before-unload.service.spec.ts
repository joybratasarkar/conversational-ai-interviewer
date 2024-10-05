import { TestBed } from '@angular/core/testing';

import { BeforeUnloadService } from './before-unload.service';

describe('BeforeUnloadService', () => {
  let service: BeforeUnloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeforeUnloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
