import { Component } from '@angular/core';
import { MealService } from '../services/meal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})
export class AddMealComponent {
  mealName: string = '';
  totalCals: number = 0;
  totalCarbs: number = 0;
  totalProts: number = 0;
  file: File | null = null;

  constructor(private mealService: MealService , private router: Router) { }
  onSubmit() {
    const formData = new FormData();
    if (this.file) {
      formData.append('multipartFile', this.file);
    }
    formData.append('mealName', this.mealName);
    formData.append('totalCals', this.totalCals.toString());
    formData.append('totalCarbs', this.totalCarbs.toString());
    formData.append('totalProts', this.totalProts.toString());
  
    this.mealService.uploadMealWithImage(formData).subscribe(
      response => {
        console.log('Upload successful', response);
        // Add navigation here
        this.router.navigate(['/allmeals']);
      },
      error => {
        console.error('Upload error', error);
        // Handle error response here
      }
    );
  }
  

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
}


