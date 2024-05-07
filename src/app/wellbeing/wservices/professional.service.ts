import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from 'src/app/user/user';
import { RelaxationExercise } from '../model/RelaxationExercise';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private baseUrl = 'http://localhost:8081/api/psychologist-customer-relation';

  constructor(private http: HttpClient) { }

  removePsychologistCustomerRelation(psychologistId: number, customerId: number): Observable<string> {
    const url = `${this.baseUrl}/psychologist/${psychologistId}/customer/${customerId}`;
    return this.http.delete(url, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error deleting psychologist-customer relation:', error);
          return throwError(error.message || 'Server error');
        })
      );
  }

  isUserSubscribedToProfessionalRole(userId: number, professionalId: number, professionalRole: string): Observable<boolean> {
    const url = `${this.baseUrl}/check/${userId}/${professionalId}/${professionalRole}`;
    return this.http.get<boolean>(url);
  }
  assignPsychologistToCustomer(psychologistId: number, customerId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign/${psychologistId}/${customerId}`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        alert('Psychologist assigned to customer successfully.');
      }),
      catchError((error: any) => {
        console.error('Error assigning psychologist to customer:', error);
        alert('An error occurred while assigning psychologist to customer. Please try again.');
        return throwError(error);
      })
    );
}

 

 
  getAllCustomersForPsychologist(psychologistId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/customers/${psychologistId}`);
  }

  assignRelaxationExerciseToCustomer(psychologistId: number, customerId: number, relaxationExercise: RelaxationExercise): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/assign-relaxation-exercise/${psychologistId}/${customerId}`, relaxationExercise).pipe(
      tap(() => {
        alert('Relaxation exercise assigned to customer successfully.');
      }),
      catchError((error: any) => {
        // Traitement de l'erreur ici
        console.error('Error:', error);
        // Vous pouvez renvoyer une observable avec une valeur par défaut ou simplement retourner null
        return of(null);
      })
    );

 
}
}