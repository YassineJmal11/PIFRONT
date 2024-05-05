import { TestBed } from '@angular/core/testing';

import { RatingserviceService } from './rating.service';
describe('RatingService', () => {
  let service: RatingserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RatingserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
