import { Component } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { UsersService } from '../users.service';
import { User } from '../user'; // Assurez-vous d'importer votre modèle User si nécessaire
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EditComponent {
  currentUser: User; // Assurez-vous d'utiliser votre modèle User

  constructor(private tokenStorageService: TokenStorageService, private userService: UsersService,private router:Router) {
    this.currentUser = this.tokenStorageService.getUser();
  }

  errorMessage: string = ''; // Variable pour stocker le message d'erreur
  successMessage: string = ''; // Variable pour stocker le message de succès


  saveChanges() {
    const username = this.currentUser.username;
    if (username) {
      this.userService.updateUser(username, this.currentUser).subscribe(updatedUser => {
        console.log('User updated:', updatedUser);
        this.tokenStorageService.saveUser(updatedUser);
        this.successMessage = 'User updated successfully.'; // Afficher le message de succès
        setTimeout(() => {
          this.successMessage = 'updating succes'; // Effacer le message de succès après un certain temps
          this.router.navigate(['/home']);
        }, 3000); // Rediriger vers la page de profil après 3 secondes
      }, error => {
        console.error('Error updating user:', error);
        this.errorMessage = 'An error occurred while updating user.'; // Afficher le message d'erreur
      });
    } else {
      this.errorMessage = 'Username is undefined'; // Afficher le message d'erreur
    }
  }
}