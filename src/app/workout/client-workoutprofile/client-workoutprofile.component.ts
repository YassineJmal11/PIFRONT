import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/diet/model/User';
import { Exercice } from '../model/Exercice';
import { ExerciceService } from '../serviceworkout/exercice.service';

@Component({
  selector: 'app-client-workoutprofile',
  templateUrl: './client-workoutprofile.component.html',
  styleUrls: ['./client-workoutprofile.component.css']
})
export class ClientWorkoutprofileComponent {
  userId: number = 0;
  exercices: Exercice[] = []

  constructor(private route: ActivatedRoute, private exerciceService: ExerciceService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadExercises();
    });
  }

  loadExercises(): void {
    this.exerciceService.getExercisesByUserId(this.userId)
      .subscribe(
        (exercises: Exercice[]) => {
          this.exercices = exercises;
        },
        (error: any) => {
          console.error('Error loading exercises:', error);
        }
      );
  }
}

