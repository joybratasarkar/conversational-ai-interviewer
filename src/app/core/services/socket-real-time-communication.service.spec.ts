import { TestBed } from '@angular/core/testing';

import { SocketRealTimeCommunicationService } from './socket-real-time-communication.service';

describe('SocketRealTimeCommunicationService', () => {
  let service: SocketRealTimeCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketRealTimeCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
