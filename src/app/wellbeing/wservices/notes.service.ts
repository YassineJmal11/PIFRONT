import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{Notes} from  '../model/Notes';
@Injectable({
  providedIn: 'root'
})
export class NotesService {


  private baseUrl = 'http://localhost:8081/api/notes'; // Assurez-vous de changer l'URL si votre API est exposée différemment

  constructor(private http: HttpClient) { }

  addNote(note: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.baseUrl}/add`, note);
  }

  updateNote(note: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.baseUrl}/update`, note);
  }

  getAllNotes(): Observable<Notes[]> {
    return this.http.get<Notes[]>(`${this.baseUrl}/all`);
  }

  getNoteById(id: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.baseUrl}/${id}`);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  addNoteWithUser(note: Notes, userId: number): Observable<Notes> {
    return this.http.post<Notes>(`${this.baseUrl}/${userId}`, note);
  }

  getNotesByUserId(userId: number): Observable<Notes[]> {
    return this.http.get<Notes[]>(`${this.baseUrl}/usernotes/${userId}`);
  }
}
