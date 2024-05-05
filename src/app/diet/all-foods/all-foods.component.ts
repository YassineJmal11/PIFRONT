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
  selectedMealId: number | null = null;
  searchTerm: string = ''; // Define searchTerm property

  constructor(
    private foodService: FoodService,
    private mealService: MealService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getMealIdFromRoute();
    this.getAllFoods();
  }

  getMealIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      const mealIdParam = params.get('mealId');
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

  searchFood(event: any): void {
    const searchTerm = (event.target as HTMLInputElement).value; // Extract value from the input element
    if (searchTerm.trim() !== '') {
      // Implement search functionality here
      // Filter foods based on search term
      this.listFood = this.listFood.filter(food =>
        food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.getAllFoods(); // If search term is empty, display all foods
    }
  }

  searchFoodByName(foodName: string): void {
    if (foodName.trim() !== '') {
      this.foodService.getFoodByName(foodName)
        .subscribe(food => {
          if (food) {
            this.listFood = [food]; // Replace the list with the found food
          } else {
            console.log('Food not found');
          }
        });
    } else {
      console.log('Please enter a valid food name');
    }
  }
}
