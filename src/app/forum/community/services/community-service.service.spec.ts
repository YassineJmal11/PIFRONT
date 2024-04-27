import { TestBed } from '@angular/core/testing';

import { CommunityServiceService } from './community-service.service';

describe('CommunityServiceService', () => {
  let service: CommunityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
