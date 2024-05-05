import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: any = {};
  error: string = '';
  constructor(private userService: UsersService, private router: Router) { }

  onSubmit(): void {
    this.userService.setPasswordWithVerification(this.form.verificationCode, this.form.newPassword)
      .subscribe(
        () => {
          this.error = ''; // Réinitialiser le message d'erreur
          this.router.navigate(['/signin']); // Redirection vers la page de réinitialisation du mot de passe
        },
        err => {
          console.error(err); // Gérer les erreurs de manière appropriée
          if (err.status === 500) {
            this.error = 'Email not found. Please enter a valid email.';
          } else {
            this.router.navigate(['/signin']); // Redirection vers la page de réinitialisation du mot de passe
          }
        }
      );
  }
}
