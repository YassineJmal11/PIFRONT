import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RelaxationExerciseServiceService } from '../../wservices/relaxation-exercise-service.service';
import { RelaxationExercise } from '../../model/RelaxationExercise';

@Component({
  selector: 'app-relaxation-exercise-list',
  templateUrl: './relaxation-exercise-list.component.html',
  styleUrls: ['./relaxation-exercise-list.component.css']
})
export class RelaxationExerciseListComponent implements OnInit {
  exercises: RelaxationExercise[] = [];

  constructor(private relaxationExerciseService: RelaxationExerciseServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.relaxationExerciseService.getAllExercises().subscribe(exercises => {
      this.exercises = exercises;
    });
  }

  deleteExercise(id: number): void {
    this.relaxationExerciseService.deleteExercise(id).subscribe(() => {
      this.loadExercises();
    });
  }

  updateExercise(exercise: RelaxationExercise): void {
    this.router.navigate(['/relaxation-exercise-update', exercise.relaxationExerciceId]); // Redirection avec l'ID de l'exercice
  }

  videoLoaded(event: any): void {
    event.target.classList.add('loaded'); // Ajouter la classe loaded lorsque la vidéo est chargée
  }
}
