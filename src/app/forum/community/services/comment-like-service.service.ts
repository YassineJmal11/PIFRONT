import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentLike } from '../../model/CommentLike';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentLikeServiceService {

  private baseUrl:string ='http://localhost:8081/api/CommentLikes';

  constructor(private http:HttpClient) { }

  createOrUpdateCommentLikeAndSetUserAndComment( commentId: number, userId: number): Observable<CommentLike> {
    return this.http.post<CommentLike>(`${this.baseUrl}/addOrUpdate/${commentId}/${userId}`,{});
  }

  findByComment_CommentId( commentId: number): Observable<CommentLike[]> {
    return this.http.get<CommentLike[]>(`${this.baseUrl}/byComment/${commentId}`);
  }

  findByUserUserIdAndComment_CommentId(userId: number, commentId: number): Observable<CommentLike> {
    return this.http.get<CommentLike>(`${this.baseUrl}/${userId}/${commentId}`);
  }



}
