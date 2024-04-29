import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UsersService } from '../users.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  currentStep: number = 1;
  usernameExists: boolean = false;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required], [this.uniqueUsernameValidator.bind(this)]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      weight: [null],
      height: [null],
      diploma: [null],
      photo: [null, Validators.required],
      roles: [['CUSTOMER'], Validators.required]
    });
  }

  get formControls() {
    return this.signUpForm.controls;
  }

  onFileChange(event: Event, controlName: string) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.signUpForm.patchValue({
        [controlName]: file
      });
    } else {
      // Si aucun fichier n'est sélectionné, attribuer null au champ "diploma" seulement si le rôle est "CUSTOMER"
      if (controlName === 'diploma' && this.selected('CUSTOMER')) {
        this.signUpForm.get('diploma')?.setValue(null);
      }
    }
  }

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    const formValue = this.signUpForm.value;


    this.loading = true;
  
    this.authService.signUp(
      formValue.username,
      formValue.firstName,
      formValue.lastName,
      formValue.email,
      formValue.password,
      formValue.phoneNumber,
      formValue.dateOfBirth,
      formValue.gender,
      formValue.weight,
      formValue.height,
      formValue.diploma,
      formValue.photo,
      formValue.roles
    )
      .subscribe(
        data => {
          this.router.navigate(['/signin']);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  selected(role: string): boolean {
    const roles = this.signUpForm.value.roles;
    return roles && roles.includes(role);
  }

  uniqueUsernameValidator(control: FormControl): Observable<any> {
    return this.userService.getUserByUsername(control.value).pipe(
      map(response => {
        if (response.exists) {
          return { usernameExists: true };
        } else {
          return null;
        }
      })
    );
  }

  checkUsernameAvailability() {
    const username = this.signUpForm.get('username')?.value;
    if (username) {
      this.userService.getUserByUsername(username).subscribe(
        response => {
          this.usernameExists = response.exists;
          if (this.usernameExists) {
            console.log('Username already exists. Please choose another one.');
            // Afficher un message d'erreur
            this.errorMessage = 'Username already exists. Please choose another one.';
          }
        },
        error => {
          console.error('Error checking username availability:', error);
          // Gérer la réponse d'erreur, le cas échéant
        }
      );
    }
  }
}
