import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Rating } from './rate';
@Injectable({
  providedIn: 'root'
})
export class RatingserviceService {

 
  private apiUrl = 'http://localhost:8081/api/ratings'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) { }
 
  
  createRating(ratedUserId: number, ratingUserId: number, ratingValue: number): Observable<any> {
    const url = `${this.apiUrl}/create`;

    // Créer un objet HttpParams pour inclure les paramètres dans la requête
    const params = new HttpParams()
      .set('ratedUserId', ratedUserId)
      .set('ratingUserId', ratingUserId)
      .set('ratingValue', ratingValue);

    // Envoyer la requête avec les paramètres
    return this.http.post(url, null, { params });
  }
  // Récupère la valeur de notation moyenne pour un utilisateur donné
  getAverageRatingForUser(ratedUserId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/average-rating/${ratedUserId}`);
  }
}