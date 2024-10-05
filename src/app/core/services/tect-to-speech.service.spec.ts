import { TestBed } from '@angular/core/testing';

import { TectToSpeechService } from './tect-to-speech.service';

describe('TectToSpeechService', () => {
  let service: TectToSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TectToSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
