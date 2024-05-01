import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from 'src/app/user/user';
import { RelaxationExercise } from '../model/RelaxationExercise';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  private baseUrl = 'http://localhost:8081/api/psychologist-customer-relation';

  constructor(private http: HttpClient) { }

  assignPsychologistToCustomer(psychologistId: number, customerId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/assign/${psychologistId}/${customerId}`, {}).pipe(
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
     
    );
  }
}
