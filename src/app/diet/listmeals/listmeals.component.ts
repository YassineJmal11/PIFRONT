import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meal } from '../model/Meal';
import { MealService } from '../services/meal.service';
import { Food } from '../model/Food';
import { User } from '../model/User';

declare var $: any;



@Component({
  selector: 'app-listmeals',
  templateUrl: './listmeals.component.html',
  styleUrls: ['./listmeals.component.css']
})
export class ListmealsComponent implements OnInit {
  listMeals: Meal[] = [];
  expandedMeals: { [mealId: number]: boolean } = {};
  mealFoods: { [mealId: number]: Food[] } = {};
  selectedMealId: number | null = null; // Declare selectedMealId property
  userList: User[] = [];
  constructor(
    private router: Router,
    private mealService: MealService
  ) {}

  ngOnInit(): void {
    this.getMeals();
    this.getAllUsers(); // Fetch users when component initializes
  }

  getMeals(): void {
    this.mealService.getMeals()
      .subscribe(meals => {
        this.listMeals = meals;
        this.listMeals.forEach(meal => this.expandedMeals[meal.mealId] = false);
      });
  }
  getAllUsers(): void {
    this.mealService.getAllUsers()
      .subscribe(users => {
        this.userList = users;
      });
  }

  deleteMeal(id: number): void {
    this.mealService.deleteMeal(id)
      .subscribe(() => {
        this.listMeals = this.listMeals.filter(meal => meal.mealId !== id);
      });
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

  addFoods(meal: Meal): void {
    this.mealService.addFoodsToMeal(meal.mealId, meal.foods)
      .subscribe(updatedMeal => {
        console.log('Foods added to meal:', updatedMeal);
      });
  }

  getFoodsForMeal(mealId: number): void {
    this.mealService.getAllFoodsForMeal(mealId)
      .subscribe(foods => {
        this.mealFoods[mealId] = foods;
      });
  }
  removeFoodFromMeal(mealId: number, foodId: number): void {
    this.mealService.removeFoodFromMeal(mealId, foodId)
      .subscribe(() => {
        // Optionally, perform any additional actions after the food is removed from the meal
        // For example, you could update the list of foods for the meal
        this.getFoodsForMeal(mealId);
      });
  }

  // Method to navigate to the "allfoods" route and pass the selected meal ID
  navigateToAllFoods(mealId: number): void {
    this.selectedMealId = mealId;
    this.router.navigate(['/allfoods', { mealId: mealId }]);
  }
  selectedUserId: number | null = null; // Declare selectedUserId property

selectUser(userId: number): void {
  this.selectedUserId = userId;
}

associateMealWithUser(mealId: number, userId: number): void {
  if (this.selectedUserId !== null) {
    this.mealService.associateMealWithUser(mealId, this.selectedUserId)
      .subscribe(() => {
        // Optionally, perform any additional actions after the association is successful
      });
  } else {
    console.error('Selected user ID is null');
  }
}

}

