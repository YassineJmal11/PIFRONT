import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workoutclient',
  templateUrl: './workoutclient.component.html',
  styleUrls: ['./workoutclient.component.css']
})
export class WorkoutclientComponent {
  constructor(private router: Router) { }

  navigateToExercises(muscleType: string) {
    // Navigate to the exercise list page with the selected muscle type
    this.router.navigate(['/exercises', muscleType]);
  }

  navigateToAddExercise() {
    // Navigate to the "addExercise" page
    this.router.navigate(['/addExercice']);
  }
}
