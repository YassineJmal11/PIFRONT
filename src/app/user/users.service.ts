import { HttpClient,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';
import { AccountStatus } from "./AccountStatus";

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
  updateUserAccountStatus(userId: number, accountStatus: AccountStatus): Observable<User> {
    const url = `${this.authUrl}/users/${userId}/status?accountStatus=${accountStatus.toUpperCase()}`;
    return this.http.put<User>(url, {});
  }
  forgotPassword(email: string): Observable<any> {
    const url = `${this.authUrl}/forgot-password`;
    return this.http.put(url, null, { params: { email } });
  
  }

  getUserIdByUsername(username: string): Observable<User> {
    const url = `${this.authUrl}/getUserIdByUsername/${username}`;
    return this.http.get<User>(url);
  }

  setPasswordWithVerification(email: string, verificationCode: string, newPassword: string): Observable<any> {
    const url = `${this.authUrl}/set-password-with-verification`;

    // Créer un objet HttpParams pour inclure les paramètres dans la requête
    const params = new HttpParams()
      .set('email', email)
      .set('verificationCode', verificationCode)
      .set('newPassword', newPassword);

    // Envoyer la requête avec les paramètres
    return this.http.put(url, null, { params });
  }

  
  

  checkAccountStatus(id: number): Observable<AccountStatus> {
    return this.http.get<AccountStatus>(`${this.authUrl}/${id}/status`);
  }

  banUser(username: String): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/users/${username}/BANNED`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.authUrl}/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.authUrl);
  }
}
