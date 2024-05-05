import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_API = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) { }

  signUp(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    dateOfBirth: string,
    gender: string,
    weight: number,
    height: number,
    diploma: File,
    photo: File,
    roles: string[]
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);
    formData.append('weight', weight !== null ? weight.toString() : ''); // Vérifier si weight est null
    formData.append('height', height !== null ? height.toString() : '');
    formData.append('diploma', diploma);
    formData.append('photo', photo);
    roles.forEach(role => formData.append('role', role));

    const httpOptions = {
      headers: new HttpHeaders({
        // Add any additional headers if needed
        // 'Authorization': 'Bearer ' + authToken
      })
    };

    return this.http.post<any>(`${this.AUTH_API}/signup`, formData, httpOptions).pipe(
      catchError(error => throwError(error))
    );
  }

  signin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/signin`, { username, password }).pipe(
      catchError(error => throwError(error))
    );
  }
  logout(): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/logout`, {}).pipe(
      catchError(error => throwError(error))
    );
  }
}