import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tip } from '../model/Tip';

@Injectable({
  providedIn: 'root'
})
export class TipService {
  private apiUrl = 'http://localhost:8081/api/tips'; 
  constructor(private http: HttpClient) { }

  getAllTips(): Observable<Tip[]> {
    return this.http.get<Tip[]>(this.apiUrl);
  }

  getTipById(id: number): Observable<Tip> {
    return this.http.get<Tip>(`${this.apiUrl}/${id}`);
  }

  saveTip(tip: Tip): Observable<Tip> {
    return this.http.post<Tip>(this.apiUrl, tip);
  }

  deleteTipById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRandomTip(): Observable<Tip> {
    return this.http.get<Tip>(`${this.apiUrl}/random-tip`);
  }
}
