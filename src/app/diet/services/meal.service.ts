import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Meal } from '../model/Meal';
import { Observable } from 'rxjs';
import { Food } from '../model/Food';
import { User } from '../model/User'; 

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private baseUrl:string ='http://localhost:8081/meals';
  constructor(private http:HttpClient) { }
 
  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(this.baseUrl+'/all')
 }
   addMeal(meal:Meal){
    return this.http.post(this.baseUrl+'/add',meal)
   }
 
   deleteMeal(id:number){
    return this.http.delete(this.baseUrl+'/delete'+'/'+id)
   }
   updateMeal(meal:Meal,id:number){
    return this.http.put(this.baseUrl+'/update'+'/'+id,meal)
  
   }

   uploadMealWithImage(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    // No need to set Content-Type header, HttpClient does it automatically for FormData
    return this.http.post<any>(`${this.baseUrl}/uploade`, formData);
  }

  addFoodsToMeal(mealId: number, foods: Food[]): Observable<any> {
    // Prepare the request body
    const requestBody = { mealId: mealId, foods: foods };

    // Send a POST request to your backend endpoint
    return this.http.post<any>(`${this.baseUrl}/addFoodsToMeal`, requestBody);

    
  }
  associateFoodWithMeal(mealId: number, foodId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${mealId}/associateFood/${foodId}`, {});
  }

  getAllFoodsForMeal(mealId: number): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.baseUrl}/${mealId}/foods`);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl+'/allUsers');
  }
  associateMealWithUser(mealId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${mealId}/associateUser/${userId}`, {});
  }
  
    // Add the new method to fetch user-specific meals
    getUserMeals(userId: number): Observable<Meal[]> {
      const url = `${this.baseUrl}/user/${userId}/meals`;
      return this.http.get<Meal[]>(url);
    }

    getUserById(userId: number): Observable<User> {
      const url = `${this.baseUrl}/user/${userId}`; // Corrected URL
      return this.http.get<User>(url);
    }
    
  // Add the method to calculate total protein for a user
  calculateTotalProteinForUser(userId: number): Observable<number> {
    const url = `${this.baseUrl}/user/${userId}/totalProtein`;
    return this.http.get<number>(url);
  }
  removeFoodFromMeal(mealId: number, foodId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${mealId}/foods/${foodId}`);
  }
  disassociateMealFromUser(mealId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${mealId}/disassociateUser/${userId}`, {});
  }

}
