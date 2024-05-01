import { Component } from '@angular/core';
import { RelaxationExercise } from '../model/RelaxationExercise';
import { RelaxationExerciseServiceService } from '../wservices/relaxation-exercise-service.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-customer-exercise',
  templateUrl: './customer-exercise.component.html',
  styleUrls: ['./customer-exercise.component.css']
})
export class CustomerExerciseComponent {
  exercises: RelaxationExercise[] = [];
  userId !: number;

  constructor(
    private route: ActivatedRoute,
    private relaxationExerciseService: RelaxationExerciseServiceService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadExercises();
    });
  }

  loadExercises(): void {
    if (this.userId) {
      this.relaxationExerciseService.getRelaxationExercisesForUser(this.userId).subscribe(
        (exercises: RelaxationExercise[]) => {
          this.exercises = exercises;
        },
        error => {
          console.log('Erreur lors du chargement des exercices de relaxation:', error);
        }
      );
    } else {
      console.log('ID de l\'utilisateur non trouvé.');
    }
  }
  deleteExercise(id: number): void {
    this.relaxationExerciseService.deleteExercise(id).subscribe(() => {
      this.loadExercises();
    });
  }

  updateExercise(exercise: RelaxationExercise): void {
    this.router.navigate(['/relaxation-exercise-update', exercise.relaxationExerciceId]); // Redirection avec l'ID de l'exercice
  }
}
