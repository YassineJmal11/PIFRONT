import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private authUrl = 'http://localhost:8081/api/auth'; // Point d'accès à votre API

  constructor(private http: HttpClient) {}
  
  getUserByUsername(username: string): Observable<any> {
    const url = `${this.authUrl}/username/${username}`;
    return this.http.get(url);

  }
  updateUser(username: string, userDetails: any): Observable<any> {
    const url = `${this.authUrl}/${username}`; // Utilisez le nom d'utilisateur au lieu de l'ID
    return this.http.put<any>(url, userDetails);
  }
}

