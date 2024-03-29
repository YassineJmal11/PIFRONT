import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
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
    roles: [],
    diploma: null,
    photo: null
  };

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  page = 1;
  usernameExists = false;

  constructor(private authService: AuthService, private router: Router, private userService: UsersService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, firstName, lastName, email, password, phoneNumber, dateOfBirth, gender, weight, height, diploma, photo } = this.form;
    
    // Assurez-vous que roles est correctement récupéré du formulaire
    const roles = Array.isArray(this.form.roles) ? this.form.roles : [this.form.roles];
  
    this.authService.signup(username, firstName, lastName, email, password, phoneNumber, dateOfBirth, gender, weight, height, roles, diploma, photo).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/signin']); // Redirige vers la page de connexion après inscription réussie
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );}

  goToSignInPage(): void {
    this.router.navigate(['/signin']); // Redirige vers la page de connexion
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  shouldDisplayDiplomaUpload(): boolean {
    if (this.form && 'roles' in this.form) {
      const selectedRoles: string[] = this.form.roles;
      return selectedRoles.includes('nutritionist') || selectedRoles.includes('psychologist') || selectedRoles.includes('coach');
    } else {
      return false;
    }
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
