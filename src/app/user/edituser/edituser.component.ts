import { Component } from '@angular/core';
import { TokenStorageService } from '../token-storage.service';
import { UsersService } from '../users.service';
import { User } from '../user'; // Assurez-vous d'importer votre modèle User si nécessaire
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EditComponent {
  currentUser: User; // Assurez-vous d'utiliser votre modèle User

  constructor(private tokenStorageService: TokenStorageService, private userService: UsersService) {
    this.currentUser = this.tokenStorageService.getUser();
  }

  saveChanges() {
    const username = this.currentUser.username;
    if (username) { // Vérifiez si userId est défini
      this.userService.updateUser(username, this.currentUser).subscribe(updatedUser => {
        console.log('User updated:', updatedUser);
        this.tokenStorageService.saveUser(updatedUser);
      }, error => {
        console.error('Error updating user:', error);
      });
    } else {
      console.error('User ID is undefined');
    }
}
}