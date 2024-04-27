import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: any = {}; // Utilisez un objet pour stocker les données du formulaire
  error: string = '';

  constructor(private userService: UsersService, private router: Router) { }

  onSubmit(): void {
    this.userService.forgotPassword(this.form.email)
      .subscribe(
        () => {
          this.error = ''; // Réinitialiser le message d'erreur
          this.router.navigate(['/reset-password']); // Redirection vers la page de réinitialisation du mot de passe
        },
        err => {
          if (err.status === 500) {
            this.error = 'Email not found. Please enter a valid email.';
          } else {
            this.router.navigate(['/reset-password']); // Redirection vers la page de réinitialisation du mot de passe
          }
        }
      );
  }
}
