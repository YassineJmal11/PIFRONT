import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../model/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private baseUrl = 'http://localhost:8081/api/sessions';

  constructor(private http: HttpClient) { }

  addSessionWithUser(session: Session, userId: number): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}/${userId}`, session);
}
getSessionsByUserId(userId: number): Observable<Session[]> {
  return this.http.get<Session[]>(`${this.baseUrl}/usersession/${userId}`);
}
}
