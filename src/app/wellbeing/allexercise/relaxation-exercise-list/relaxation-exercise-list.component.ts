import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RelaxationExerciseServiceService } from '../../wservices/relaxation-exercise-service.service';
import { RelaxationExercise } from '../../model/RelaxationExercise';
import { ProfessionalService } from '../../wservices/professional.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
@Component({
  selector: 'app-relaxation-exercise-list',
  templateUrl: './relaxation-exercise-list.component.html',
  styleUrls: ['./relaxation-exercise-list.component.css']
})
export class RelaxationExerciseListComponent implements OnInit {
  exercises: RelaxationExercise[] = [];

  constructor(private relaxationExerciseService: RelaxationExerciseServiceService, private router: Router,private professionalService:ProfessionalService
    ,private tokenstorageservice :TokenStorageService, private userservice: UsersService
  ) { }

  ngOnInit(): void {
    this.loadExercises();
    console.log(this.exercises);

  }

  loadExercises(): void {
    this.relaxationExerciseService.getAllExercises().subscribe(exercises => {
      this.exercises = exercises;

    });
    console.log(this.exercises);

  }

  deleteExercise(id: number): void {
    this.relaxationExerciseService.deleteExerciceAndUserProgress(id).subscribe(() => {
      this.loadExercises();
    });
  }

  updateExercise(exercise: RelaxationExercise): void {
    this.router.navigate(['/relaxation-exercise-update', exercise.relaxationExerciceId]); // Redirection avec l'ID de l'exercice
  }

  videoLoaded(event: any): void {
    event.target.classList.add('loaded'); // Ajouter la classe loaded lorsque la vidéo est chargée
  }
  goToAddExercise(): void {
    this.router.navigate(['/addexercise']);
  }


  private getCustomerIdFromURL(): number | null {
    const urlSegments = window.location.pathname.split('/');
    const userIdSegmentIndex = urlSegments.indexOf('listexercises');
    if (userIdSegmentIndex !== -1 && userIdSegmentIndex < urlSegments.length - 1) {
      return +urlSegments[userIdSegmentIndex + 1];
    }
    return null;
  }
  assignExercise(exercise: RelaxationExercise): void {
    // Récupérez l'ID du psychologue depuis le stockage local
    const psychologistName = this.tokenstorageservice.getUser().username;
  
    // Récupérez l'Observable pour l'ID du psychologue
    const psychologistId$ = this.userservice.getUserIdByUsernames(psychologistName!);
  
    // Abonnez-vous à l'Observable pour récupérer l'ID du psychologue
    psychologistId$.subscribe(
      (psychologistId: number) => {
        if (!psychologistId) {
          console.error('Psychologist ID not found in session storage.');
          return;
        }
  
        // Récupérez l'ID du client depuis l'URL
        const customerId = this.getCustomerIdFromURL();
        if (!customerId) {
          console.error('Customer ID not found in URL.');
          return;
        }
  
        // Appelez la fonction du service pour assigner l'exercice
        this.professionalService.assignRelaxationExerciseToCustomer(psychologistId, customerId, exercise).subscribe(
          () => {
            alert('Relaxation exercise assigned to customer successfully.');
            // Redirection vers le composant Psycustomer
            this.router.navigate(['/psycustomer']); // Assurez-vous que le chemin vers Psycustomer est correct
          },
        
        );
      },
      error => {
        console.error('Error getting psychologist ID:', error);
        alert('An error occurred while getting psychologist ID. Please try again.');
      }
    );
  }
}  
  
