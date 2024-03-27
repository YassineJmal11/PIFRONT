import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../token-storage.service';
import { UsersService } from '../users.service'; // Importez le service UsersService avec le bon chemin

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: any;

  constructor(private token: TokenStorageService, private router: Router, private usersService: UsersService) { } // Injectez UsersService dans le constructeur

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  logout(): void {
    this.token.signOut();
    this.router.navigate(['/home']);
  }

  editProfile(): void {
    this.usersService.updateUser(this.currentUser.id, this.currentUser).subscribe(
      data => {
        console.log(data); // Affichez la réponse du backend pour la mise à jour du profil
        // Vous pouvez également ajouter une notification ou un message de succès ici
      },
      error => {
        console.log(error); // Gérez les erreurs en cas d'échec de la mise à jour du profil
        // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
      }
    );
  }
}
