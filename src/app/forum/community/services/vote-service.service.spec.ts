import { TestBed } from '@angular/core/testing';

import { VoteServiceService } from './vote-service.service';

describe('VoteServiceService', () => {
  let service: VoteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
