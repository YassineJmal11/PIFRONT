import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../model/Food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:8081/foods'; 

  constructor(private http: HttpClient) { }

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiUrl}/all`);
  }

  getFoodById(foodId: number): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/${foodId}`);
  }

  addFood(food: Food): Observable<Food> {
    return this.http.post<Food>(`${this.apiUrl}/add`, food);
  }

  updateFood(foodId: number, food: Food): Observable<Food> {
    return this.http.put<Food>(`${this.apiUrl}/update/${foodId}`, food);
  }

  deleteFood(foodId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${foodId}`);
  }
  getFoodByName(foodName: string): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/byname?foodName=${foodName}`);
  }
}
