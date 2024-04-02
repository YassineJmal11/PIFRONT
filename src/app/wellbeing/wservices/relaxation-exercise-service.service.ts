import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RelaxationExercise } from '../model/RelaxationExercise';

@Injectable({
  providedIn: 'root'
})
export class RelaxationExerciseServiceService {

  private baseUrl = 'http://localhost:8089/relaxation-exercises';

  constructor(private http: HttpClient) { }

  getAllExercises(): Observable<RelaxationExercise[]> {
    return this.http.get<RelaxationExercise[]>(`${this.baseUrl}/all`);
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

    return this.http.post<any>(`${this.baseUrl}/upload-exercise`, formData).pipe(
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

  deleteExercise(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  updateExercise(exercise: RelaxationExercise): Observable<RelaxationExercise> {
    return this.http.put<RelaxationExercise>(`${this.baseUrl}/update`, exercise).pipe(
      tap((updatedExercise: RelaxationExercise) => {
        alert('Exercise updated successfully.'); // Afficher le message de succès
      }),
      catchError((error: any) => {
        console.error('Erreur lors de la mise à jour de l\'exercice:', error);
        alert('Une erreur s\'est produite lors de la mise à jour de l\'exercice. Veuillez réessayer.');
        return throwError(error); // Rejeter l'erreur pour la transmettre au subscriber
      })
    );
  }
}
