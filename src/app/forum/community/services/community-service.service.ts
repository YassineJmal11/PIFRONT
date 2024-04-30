import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Community } from '../../model/Community';

@Injectable({
  providedIn: 'root'
})
export class CommunityServiceService {
  private baseUrl:string ='http://localhost:8081/api/communities'

  constructor(private http:HttpClient) { }

  createCommunityAndSetUser(c:Community, userId:number){
    return this.http.post(this.baseUrl+'/add/'+userId,c);
  }



  addUserToCommunity(communityId: number, userId: number) {
    return this.http.post(`${this.baseUrl}/${communityId}/addUser/${userId}`, {});
  }
  

  getJoinedByUserId(userId:number){
    return this.http.get(this.baseUrl+'/all/'+userId);
  }

  getByCreatorId(userId:number){
    return this.http.get(this.baseUrl+'/byCreator/'+userId);
  }

  getByCommunityId(communityId:number){
    return this.http.get(this.baseUrl+'/'+communityId);
  }
  deleteCommunity(communityId:number){
    return this.http.delete(this.baseUrl+'/delete/'+communityId);
  }
  getCommunitiesOrderByMembers(){
    return this.http.get(this.baseUrl+'/popularCommunities');
  }
  
}
