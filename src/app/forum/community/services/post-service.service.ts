import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../model/Post';
import { Page } from '../../model/Page';

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

  findByUserJoinedCommunities(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/JoinedCommunitiesPosts/${userId}`);
  }

  getPostById(userId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${userId}`);
  }

  findByUserJoinedCommunitiesPaginated(userId: number, page: number, size: number): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.baseUrl}/user/${userId}/communities?page=${page}&size=${size}`);
  }
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${postId}`);
  }

  findByTextContentContaining(text: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/search/${text}`);
  }


  findTop50ByOrderByVotesDesc(page: number, size: number): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.baseUrl}/popularPosts?page=${page}&size=${size}`);
  }

  getSearchSuggestions(text: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/searchSuggestions/${text}`);
  }
  
  

  


  
  
  
  
}
