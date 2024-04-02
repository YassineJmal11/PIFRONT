import { TestBed } from '@angular/core/testing';

import { RelaxationExerciseServiceService } from './relaxation-exercise-service.service';

describe('RelaxationExerciseServiceService', () => {
  let service: RelaxationExerciseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelaxationExerciseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
