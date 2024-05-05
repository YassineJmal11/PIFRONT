import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/diet/model/User'; // Import the User model if not already imported

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {
  private baseUrl = 'http://localhost:8081/api/exercices'; // Assuming this is your base URL

  constructor(private http: HttpClient) { }

  uploadExercice(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload-exercice`, formData);
  }

  getExercisesByMuscleType(muscleType: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/type/${muscleType}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl+'/workoutallUsers');
  }

  associateExerciseWithUser(exerciseId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${exerciseId}/associate-exercise-with-user/${userId}`, {});
  }
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/Myuser/${userId}`);
  }
  getExercisesByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}/exercises`);
  }
}
