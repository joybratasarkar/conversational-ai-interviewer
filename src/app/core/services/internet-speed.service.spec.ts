import { TestBed } from '@angular/core/testing';

import { InternetSpeedService } from './internet-speed.service';

describe('InternetSpeedService', () => {
  let service: InternetSpeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetSpeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
