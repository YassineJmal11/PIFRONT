import { Component, OnInit } from '@angular/core';
import { Food } from '../model/Food';
import { MealService } from '../services/meal.service'; 
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FoodService } from '../services/food.service';

@Component({
  selector: 'app-all-foods',
  templateUrl: './all-foods.component.html',
  styleUrls: ['./all-foods.component.css']
})
export class AllFoodsComponent implements OnInit {
  listFood: Food[] = [];
  selectedMealId: number | null = null; // Define selectedMealId property

  constructor(
    private foodService: FoodService,
    private mealService: MealService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getMealIdFromRoute(); // Call method to get mealId from route
    this.getAllFoods();
  }

  getMealIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      // Extract mealId from route parameters
      const mealIdParam = params.get('mealId');
      // Convert mealId to a number (if provided)
      this.selectedMealId = mealIdParam ? +mealIdParam : null;
    });
  }

  getAllFoods(): void {
    this.foodService.getAllFoods()
      .subscribe(foods => {
        this.listFood = foods;
      });
  }

  associateFoodWithMeal(mealId: number, foodId: number): void {
    this.mealService.associateFoodWithMeal(mealId, foodId)
      .subscribe(() => {
        console.log('Food associated with meal successfully');
        // Perform any additional actions if needed
      });
  }
  handleFoodClick(foodId: number): void {
    console.log('Food clicked:', foodId);
    if (this.selectedMealId !== null) {
      this.associateFoodWithMeal(this.selectedMealId, foodId);
    } else {
      console.log("No meal selected. Cannot associate food.");
    }
  }
}
