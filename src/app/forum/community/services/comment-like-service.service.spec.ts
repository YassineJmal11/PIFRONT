import { TestBed } from '@angular/core/testing';

import { CommentLikeServiceService } from './comment-like-service.service';

describe('CommentLikeServiceService', () => {
  let service: CommentLikeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentLikeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
