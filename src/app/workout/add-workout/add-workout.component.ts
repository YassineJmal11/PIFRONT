import { Component } from '@angular/core';
import { ExerciceService } from '../serviceworkout/exercice.service';
import { Router, Routes } from '@angular/router';
import { WorkoutclientComponent } from '../workoutclient/workoutclient.component';



@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.css']
})
export class AddWorkoutComponent {
  exerciceName: string = '';
  muscle: string = '';
  musclesList: string[] = ['CHEST', 'BACK', 'ARMS', 'ABDOMINALS', 'LEGS', 'SHOULDERS', 'CALVES', 'QUADRICEPS', 'GLUTES', 'BICEPS', 'TRICEPS', 'FOREARMS', 'TRAPEZIUS', 'LATISSIMUS DORSI'];


  selectedFile: File | null = null;

  constructor(private exerciceService: ExerciceService, private router: Router) { }

  onSubmit() {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('multipartFile', this.selectedFile);
    }
    formData.append('exerciceName', this.exerciceName);
    formData.append('muscle', this.muscle);

    this.exerciceService.uploadExercice(formData)
      .subscribe(
        response => {
          console.log('Upload successful', response);
          this.router.navigateByUrl('/clientworkout');
          ;
        },
        error => {
          console.error('Upload error', error);
          // Handle error response here
        }
      );
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
}
