import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
@Component({
  selector: 'app-signupadmin',
  templateUrl: './signupadmin.component.html',
  styleUrls: ['./signupadmin.component.css']
})
export class SignupadminComponent {
  form: any = {
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phoneNumber: null,
    dateOfBirth: null,
    gender: null,
    weight: null,
    height: null,
    diploma: null,
    photo: null
  };

  selectedRoles: string[] = [];
  availableRoles: string[] = ['CUSTOMER', 'NUTRITIONIST', 'PSYCHOLOGIST', 'COACH'];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  page = 1;
  usernameExists = false;

  constructor(private authService: AuthService, private router: Router, private userService: UsersService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, password, firstName, lastName, email, phoneNumber, dateOfBirth, gender, weight, height, diploma, photo } = this.form;
    
    this.authService.signup(username, password, firstName, lastName, email, phoneNumber, dateOfBirth, gender, weight, height, this.selectedRoles, diploma, photo).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/ALL']); // Redirige vers la page de connexion après inscription réussie
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

  goToSignInPage(): void {
    this.router.navigate(['/ALL']); // Redirige vers la page de connexion
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  shouldDisplayDiplomaUpload(): boolean {
    return this.selectedRoles.includes('NUTRITIONIST') || this.selectedRoles.includes('PSYCHOLOGIST') || this.selectedRoles.includes('COACH')|| this.selectedRoles.includes('ADMIN');
  }

  checkUsernameAvailability() {
    const username = this.form.username;
    if (username) {
      this.userService.getUserByUsername(username).subscribe(
        response => {
          this.usernameExists = response.exists;
          if (this.usernameExists) {
            console.log('Username already exists. Please choose another one.');
            // Optionally, you can display a message to the user
            this.errorMessage = 'Username already exists. Please choose another one.';
          }
        },
        error => {
          console.error('Error checking username availability:', error);
          // Handle error response, if any
        }
      );
    }
  }
}
