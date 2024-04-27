import { Injectable } from '@angular/core';
import { Goal } from '../goalTrack/model/Goal';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GoalServiceService {
  private baseUrl:string ='http://localhost:8081/api/Goals'
  constructor(private http:HttpClient) { }

  getGoals(){
    return this.http.get<Goal[]>(this.baseUrl+'/getAll')
  }
  getGoalsByUserId(id:number){
    return this.http.get<Goal[]>(`${this.baseUrl}/byUser/${id}`)
  }

  //completed
  findCompletedByUserIdBeforeDeadline(userId: number) {
    return this.http.get<Goal[]>(`${this.baseUrl}/beforeDeadline/${userId}`);
  }

   //not completed
   findNotCompletedByUserIdAfterDeadline(userId: number) {
    return this.http.get<Goal[]>(`${this.baseUrl}/afterDeadline/${userId}`);
  }

  
    findByUserUserIdOrderByProgressAsc(userId: number) {
      return this.http.get<Goal[]>(`${this.baseUrl}/OrderByProgressAsc/${userId}`);
    }

    
      findByUserUserIdOrderByProgressDesc(userId: number) {
    return this.http.get<Goal[]>(`${this.baseUrl}/OrderByProgressDesc/${userId}`);
  }

    
    findByUserUserIdOrderByDeadlineAsc(userId: number) {
      return this.http.get<Goal[]>(`${this.baseUrl}/OrderByDeadlineAsc/${userId}`);
    }

      findByUserUserIdOrderByDeadlineDesc(userId: number) {
    return this.http.get<Goal[]>(`${this.baseUrl}/OrderByDeadlineDesc/${userId}`);
  }

  search(userId: number, text: string) {
    return this.http.get<Goal[]>(`${this.baseUrl}/Search/${userId}?text=${text}`);
  }
  getGoalById(id:number){
    return this.http.get<Goal>(this.baseUrl+'/'+id)
  }
  AddGoal(p:Goal){
    return this.http.post(this.baseUrl+'/add',p)
  }

  createGoalAndSetUser(t:Goal, userId:number){
    return this.http.post(this.baseUrl+'/add/'+userId,t)
  }
  DeleteGoal(id:number){
    return this.http.delete(this.baseUrl+'/delete'+'/'+id)
  }
  updateGoal(p:Goal){
    return this.http.put(this.baseUrl+'/update',p)
  }
}
