import { Component } from '@angular/core';
import { ProfessionalService } from '../wservices/professional.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { User } from 'src/app/user/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-psy-customers',
  templateUrl: './psy-customers.component.html',
  styleUrls: ['./psy-customers.component.css']
})
export class PsyCustomersComponent {

  customers: User[] = [];

  constructor(
    private professionalService: ProfessionalService,
    private userService: UsersService,
    private tokenStorageService: TokenStorageService, 
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    const currentUser = this.tokenStorageService.getUser();
    console.log('UserName:', currentUser.username);

    if (currentUser && currentUser.username) {
      this.userService.getUserIdByUsernames(currentUser.username).subscribe((psychologistId) => {
        console.log('Psychologist ID:', psychologistId);

        if (psychologistId) {
          this.professionalService.getAllCustomersForPsychologist(psychologistId).subscribe((customers: User[]) => {
            console.log('Customers:', customers);
            this.customers = customers;
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

  redirectToCustomerExercises(userId: number): void {
    this.router.navigate(['/customerexercise', userId]);

  }
  assignExercises(userId: number): void {
    this.router.navigate(['/listexercises', userId]);
  }
}
