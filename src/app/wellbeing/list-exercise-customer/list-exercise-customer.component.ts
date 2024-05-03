import { Component, OnInit } from '@angular/core';
import { RelaxationExercise } from '../model/RelaxationExercise';
import { RelaxationExerciseServiceService } from '../wservices/relaxation-exercise-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';

@Component({
  selector: 'app-list-exercise-customer',
  templateUrl: './list-exercise-customer.component.html',
  styleUrls: ['./list-exercise-customer.component.css']
})
export class ListExerciseCustomerComponent implements OnInit {
  exercises: RelaxationExercise[] = [];
  userId!: number;
  totalExercisesCount: number = 0;
  completedExercisesCount: number = 0;
  averageProgress: number = 0;

  constructor(
    private relaxationExerciseService: RelaxationExerciseServiceService,
    private tokenstorageservice: TokenStorageService,
    private userservice: UsersService
  ) { }

  ngOnInit(): void {
    this.loadExercises();
    this.getTotalExercisesCount();
  }

  getTotalExercisesCount(): void {
    const customerName = this.tokenstorageservice.getUser().username;
    this.userservice.getUserIdByUsernames(customerName).subscribe(
      (customerId: number) => {
        if (!customerId) {
          console.error('ID de l\'utilisateur non trouvé.');
          return;
        }
  
        this.relaxationExerciseService.countExercisesForUser(customerId).subscribe(
          count => {
            this.totalExercisesCount = count;
            this.updateProgress();
          },
          error => {
            console.error('Erreur lors de la récupération du nombre total d\'exercices:', error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur:', error);
      }
    );
  }
  

  updateProgress(): void {
    if (this.totalExercisesCount > 0) {
      this.averageProgress = (this.completedExercisesCount / this.totalExercisesCount) * 100;
    } else {
      this.averageProgress = 0;
    }
  }

  loadExercises(): void {
    const customerName = this.tokenstorageservice.getUser().username;
    this.userservice.getUserIdByUsernames(customerName).subscribe(
      (customerId: number) => {
        if (!customerId) {
          console.error('ID de l\'utilisateur non trouvé.');
          return;
        }
  
        this.relaxationExerciseService.getRelaxationExercisesForUser(customerId).subscribe(
          (exercises: RelaxationExercise[]) => {
            this.exercises = exercises;
  
            // Nouvelle partie pour vérifier si chaque exercice est terminé
            this.exercises.forEach(exercise => {
              this.relaxationExerciseService.isRelaxationExerciseCompleted(customerId, exercise.relaxationExerciceId).subscribe(
                (completed: boolean) => {
                  exercise.completed = completed;
                  if (completed) {
                    this.completedExercisesCount++;
                  }
                  this.updateProgress();
                },
                error => {
                  console.error('Erreur lors de la vérification de la complétion de l\'exercice:', error);
                }
              );
            });
          },
          error => {
            console.error('Erreur lors du chargement des exercices de relaxation:', error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur:', error);
      }
    );
  }
  

  markExerciseAsWatched(exercise: RelaxationExercise): void {
    if (!exercise.completed) {
      const customerName = this.tokenstorageservice.getUser().username;
      this.userservice.getUserIdByUsernames(customerName).subscribe(
        (cusId: number) => {
          this.relaxationExerciseService.markExerciseAsWatched(cusId, exercise.relaxationExerciceId).subscribe(
            () => {
              console.log('L\'exercice a été marqué comme vu avec succès.');
              exercise.completed = true; // Mettre à jour la propriété completed de l'exercice
              this.completedExercisesCount++;
              this.updateProgress();
            },
            error => {
              console.error('Une erreur est survenue lors de la tentative de marquage de l\'exercice comme vu :', error);
            }
          );
        },
        error => {
          console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur:', error);
        }
      );
    }
  }
}