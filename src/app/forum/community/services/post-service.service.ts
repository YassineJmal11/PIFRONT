import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../model/Post';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private baseUrl:string ='http://localhost:8081/api/Posts';

  constructor(private http:HttpClient) { }

  createPost(userId: number, communityId: number, attachment: File | undefined, post: Post): Observable<Post> {
    console.log('Attachment:', attachment); // Check if attachment is received correctly
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('communityId', communityId.toString());
    formData.append('textContent', post.textContent);
    formData.append('postType', post.postType); // Append other fields as needed
    
    // Append the attachment if it exists
    if (attachment instanceof File) {
      formData.append('attachment', attachment, attachment.name);
    }
    
    return this.http.post<Post>(`${this.baseUrl}/addPost`, formData);
  }

  findByCommunityCommunityId(communityId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/all/${communityId}`);
  }

  


  
  
  
  
}
