import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vote } from '../../model/Vote';
import { VoteType } from '../../model/VoteType';

@Injectable({
  providedIn: 'root'
})
export class VoteServiceService {
  private baseUrl:string ='http://localhost:8081/api/Votes';

  constructor(private http:HttpClient) { }

  createOrUpdateVote(vote: Vote, postId: number, userId: number) {
    const url = `${this.baseUrl}/createOrUpdate/${postId}/${userId}`;
    return this.http.post<Vote>(url, vote);
  }

  deleteVoteByUserAndPost(postId: number, userId: number) {
    const url = `${this.baseUrl}/deleteByUserAndPost/${postId}/${userId}`;
    return this.http.delete<void>(url);
  }

  findByPostIdAndUserId(postId: number, userId: number) {
    const url = `${this.baseUrl}/${postId}/${userId}`;
    return this.http.get<Vote>(url);
  }

  findByPostIdAndVoteTypeUpvote(postId: number) {
    const url = `${this.baseUrl}/upvote/${postId}`;
    return this.http.get<Vote[]>(url);
  }

  findByPostPostIdAndVoteTypeDownvote(postId: number) {
    const url = `${this.baseUrl}/downvote/${postId}`;
    return this.http.get<Vote[]>(url);
  }
 
}
