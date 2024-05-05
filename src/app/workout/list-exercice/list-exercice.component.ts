import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExerciceService } from '../serviceworkout/exercice.service';
import { Exercice } from '../model/Exercice';
import { User } from 'src/app/user/user';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { ProfessionalService } from 'src/app/wellbeing/wservices/professional.service';
import { UsersService } from 'src/app/user/users.service';



@Component({
  selector: 'app-list-exercice',
  templateUrl: './list-exercice.component.html',
  styleUrls: ['./list-exercice.component.css']
})
export class ListExerciceComponent implements OnInit {
  exercices: Exercice[] = [];
  muscleType!: string;
  userList: User[] = [];

  constructor(
    private route: ActivatedRoute,
    private exerciceService: ExerciceService,
    private tokenStorageService: TokenStorageService, 
    private professionalService: ProfessionalService,
    private userService: UsersService,
  ) { }

  ngOnInit(): void {
    // Get the muscle type from the route parameters
    this.route.params.subscribe(params => {
      this.muscleType = params['muscleType'];
      this.loadExercises();
      this.getAllUsers();
    });
  }

  loadExercises(): void {
    this.exerciceService.getExercisesByMuscleType(this.muscleType)
      .subscribe(
        (exercices: Exercice[]) => { // Specify the type of 'exercices'
          this.exercices = exercices;
        },
        (error: any) => { // Specify the type of 'error'
          console.error('Error loading exercises:', error);
        }
      );
  }
  getAllUsers(): void {
    const currentUser = this.tokenStorageService.getUser();
    console.log('UserName:', currentUser.username);

    if (currentUser && currentUser.username) {
      this.userService.getUserIdByUsernames(currentUser.username).subscribe((psychologistId) => {
        console.log('Psychologist ID:', psychologistId);

        if (psychologistId) {
          this.professionalService.getAllCustomersForPsychologist(psychologistId).subscribe((customers: User[]) => {
            console.log('Customers:', customers);
            this.userList = customers;
          }, (error) => {
            console.error('Error fetching customers:', error);
          });
        } else {
          console.error('Psychologist ID not found');
        }
      }, (error) => {
        console.error('Error fetching psychologist ID by username:', error);
      });
    } else {
      console.error('Current user or username not found');
    }
  }
  selectedUserId: number | null = null; // Declare selectedUserId property

  selectUser(userId: number): void {
    this.selectedUserId = userId;
  }
  associateExerciseWithUser(exerciseId: number, userId: number): void {
    if (this.selectedUserId) {
      this.exerciceService.associateExerciseWithUser(exerciseId, this.selectedUserId)
        .subscribe(response => {
          // Handle success or error response if needed
          console.log('Exercise associated with user successfully:', response);
        }, error => {
          console.error('Error associating exercise with user:', error);
        });
    } else {
      console.error('No user selected');
    }
  }
}
