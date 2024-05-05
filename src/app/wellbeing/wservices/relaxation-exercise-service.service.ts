import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RelaxationExercise } from '../model/RelaxationExercise';

@Injectable({
  providedIn: 'root'
})
export class RelaxationExerciseServiceService {

  private baseUrl = 'http://localhost:8081/relaxation-exercises';

  constructor(private http: HttpClient) { }

  getAllExercises(): Observable<RelaxationExercise[]> {
    return this.http.get<RelaxationExercise[]>(`${this.baseUrl}/all-exercises`);
  }

  getExerciseById(id: number): Observable<RelaxationExercise> {
    return this.http.get<RelaxationExercise>(`${this.baseUrl}/${id}`);
  }

  uploadExercise(file: File, name: string, instructions: string, duration: number, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('instructions', instructions);
    formData.append('duration', duration.toString());
    formData.append('type', type);
  
    return this.http.post(`${this.baseUrl}/upload-exercise`, formData, { responseType: 'text' }).pipe(
      tap((response: any) => {
        alert('Exercise uploaded successfully.'); // Afficher le message de succès
      }),
      catchError((error: any) => {
        console.error('Erreur lors du téléchargement de l\'exercice:', error);
        alert('Une erreur s\'est produite lors du téléchargement de l\'exercice. Veuillez réessayer.');
        return throwError(error); // Rejeter l'erreur pour la transmettre au subscriber
      })
    );
  }
  
  

 
  deleteExerciceAndUserProgress(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateExercise(exercise: RelaxationExercise): Observable<any> {
    const url = `${this.baseUrl}/update-exercise/${exercise.relaxationExerciceId}`; // Utilisation de la nouvelle URL avec l'identifiant de l'exercice
    return this.http.put<any>(url, exercise).pipe(
      tap(() => {
        alert('Exercise updated successfully.');
      }),
     
    );
  }
  getRelaxationExercisesForUser(userId: number): Observable<RelaxationExercise[]> {
    return this.http.get<RelaxationExercise[]>(`${this.baseUrl}/user/${userId}/relaxation-exercises`);
  }

  markExerciseAsWatched(userId: number, exerciseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/mark-exercise-as-watched/${userId}/${exerciseId}`, {});
  }

  countExercisesForUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/exercises-count/${userId}`);
  }

  isRelaxationExerciseCompleted(userId: number, exerciseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/relaxation-completed/${userId}/${exerciseId}`);
  }
}
