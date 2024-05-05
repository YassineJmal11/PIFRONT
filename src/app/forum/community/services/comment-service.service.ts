import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../../model/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentServiceService {

  private baseUrl:string ='http://localhost:8081/api/Comments';

  constructor(private http:HttpClient) { }

  createComment(comment: Comment, userId: number, postId: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/add/${userId}/${postId}`, comment);
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/byPostId/${postId}`);
  }

  createReply(commentId: number, userId: number, reply: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/addReply/${commentId}/${userId}`, reply);
  }



  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`);
  }

  


  
  
  
}
