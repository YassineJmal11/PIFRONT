import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

const AUTH_API = 'http://localhost:8081/api/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private AUTH_API ='http://localhost:8081/api/auth';
  
  signup(username: string, firstName: string, lastName: string, email: string, password: string, phoneNumber: string, dateOfBirth: Date | null, gender: string, weight: number | null, height: number | null, roles: string[], diploma: any, photo: any): Observable<any> {
    const formData = {
      username,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      weight,
      height,
      roles,
      diploma,
      photo
    };
    return this.http.post(`${AUTH_API}/signup`, formData);
  }
  
  signin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/signin`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify({ username: response.username }));
      })
    );
}}
