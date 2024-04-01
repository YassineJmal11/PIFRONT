import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Meal } from '../model/Meal';
import { MealService } from '../services/meal.service';
import { Food } from '../model/Food';
import { User } from '../model/User';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
  
})
export class ClientProfileComponent implements OnInit, OnDestroy {
  userId: number = 0; 
  userMeals: Meal[] = [];
  user: User | undefined;
  mealFoods: { [mealId: number]: Food[] } = {};
  expandedMeals: { [mealId: number]: boolean } = {};
  isLoading: boolean = true; // Flag to indicate data loading state
  private routeSub: Subscription | undefined;
  listMeals: Meal[] = []; // Define listMeals property

  constructor(private route: ActivatedRoute, private mealService: MealService) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.userId = +params.get('userId')! || 0;
      this.fetchUserDetails(); // Fetch user details based on the ID
      this.fetchUserMeals(); // Fetch meals associated with the user
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  fetchUserDetails(): void {
    this.mealService.getUserById(this.userId)
      .subscribe(
        (user: User) => {
          this.user = user; // Assign the fetched user details
          this.isLoading = false; // Data loading completed
        },
        (error) => {
          console.error('Error fetching user details:', error);
          // Handle error (e.g., show error message)
          this.isLoading = false; // Data loading completed (even if it failed)
        }
      );
  }
  

  fetchUserMeals(): void {
    this.mealService.getUserMeals(this.userId)
      .subscribe(
        (meals: Meal[]) => {
          this.userMeals = meals;
          this.listMeals = meals; // Assign user meals to listMeals property
          this.userMeals.forEach(meal => {
            this.getFoodsForMeal(meal.mealId);
          });
        },
        (error) => {
          console.error('Error fetching user meals:', error);
          // Handle error (e.g., show error message)
        }
      );
  }

  toggleFoods(mealId: number): void {
    this.expandedMeals[mealId] = !this.expandedMeals[mealId];
  
    if (!this.mealFoods[mealId] && this.expandedMeals[mealId]) {
      this.getFoodsForMeal(mealId);
    }
  }

  isExpanded(mealId: number): boolean {
    return !!this.expandedMeals[mealId];
  }

  getFoodsForMeal(mealId: number): void {
    this.mealService.getAllFoodsForMeal(mealId)
      .subscribe(
        (foods: Food[]) => {
          this.mealFoods[mealId] = foods;
        },
        (error) => {
          console.error(`Error fetching foods for meal ${mealId}:`, error);
          // Handle error (e.g., show error message)
        }
      );
  }
  
}
