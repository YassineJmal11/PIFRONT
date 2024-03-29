import { TestBed } from '@angular/core/testing';

import { GoalServiceService } from './goal-service.service';

describe('GoalServiceService', () => {
  let service: GoalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
