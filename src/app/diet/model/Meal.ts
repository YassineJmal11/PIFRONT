import { Food } from './Food';

export class Meal {
    mealId!: number;
    mealName!: string;
    totalCals!: number;
    totalCarbs!: number;
    totalprots!: number;
    mealImageUrl!:string; 
    foods!: Food[];
    
    
}