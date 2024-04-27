import { Injectable } from '@angular/core';
import { Task } from '../goalTrack/model/Task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private baseUrl:string ='http://localhost:8081/api/tasks'
  private goalId!:number;
  constructor(private http:HttpClient) { }

  getTasks(){
    return this.http.get<Task[]>(this.baseUrl+'/getAll')
  }

  getTaskById(id:number){
    return this.http.get<Task>(this.baseUrl+'/'+id)
  }
  AddTask(p:Task){
    return this.http.post(this.baseUrl+'/add',p)
  }
  AddTaskAndSetGoal(t:Task, goalId:number){
    return this.http.post(this.baseUrl+'/add/'+goalId,t)
  }
  DeleteTask(id:number){
    return this.http.delete(this.baseUrl+'/delete'+'/'+id)
  }
  updateTask(p:Task){
    return this.http.put(this.baseUrl+'/update',p)
  }
  getTasksByGoalId(goalId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/byGoal/${goalId}`);
  }
  findByUserUserId(userId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/byUser/${userId}`);
  }

  //completed
  findCompletedByUserUserIdBeforeDeadline(userId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/beforeDeadline/${userId}`);
  }

  //not completed
  findNotCompletedByUserIdAfterDeadline(userId: number) {
    return this.http.get<Task[]>(`${this.baseUrl}/afterDeadline/${userId}`);
  }
  getGoalId(){
    return this.goalId;
  }
  setGoalId(goalId:number){
     this.goalId=goalId;
  }
}
