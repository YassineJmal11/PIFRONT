import { Component } from '@angular/core';
import { TokenStorageService } from '../user/token-storage.service';
import { Router } from '@angular/router';
import { UsersService } from '../user/users.service'; // Importez le service UsersService avec le bon chemin

@Component({
  selector: 'app-after-login',
  templateUrl: './after-login.component.html',
  styleUrls: ['./after-login.component.css']
})
export class AfterLoginComponent {

  isCustomer: boolean = false;
  isCoach: boolean = false;
  isPsy : boolean = false;
  isNutri : boolean = false;
  // Déclarez la variable correctement
   roles: string[] = [];
   constructor(private tokenStorageService: TokenStorageService, private router: Router,private usersService: UsersService) {
     // Vérifie si l'utilisateur est un client
     this.roles = this.tokenStorageService.getUser().roles; // Utilisez 'this' pour faire référence à la propriété de la classe
     if (this.roles.includes('CUSTOMER'))
       this.isCustomer = true;

     this.roles = this.tokenStorageService.getUser().roles; // Utilisez 'this' pour faire référence à la propriété de la classe
     if (this.roles.includes('COACH'))
       this.isCoach = true;
     this.roles = this.tokenStorageService.getUser().roles; // Utilisez 'this' pour faire référence à la propriété de la classe
     if (this.roles.includes('NUTRITIONIST'))
       this.isNutri = true;
     this.roles = this.tokenStorageService.getUser().roles; // Utilisez 'this' pour faire référence à la propriété de la classe
     if (this.roles.includes('PSYCHOLOGIST'))
       this.isPsy = true;
       
   }
   
   logout(): void {
    // Déconnexion côté serveur
    this.usersService.logoutUser().subscribe(
      () => {
        // Réussi
        // Effacer les données de l'utilisateur stockées localement
        this.tokenStorageService.signOut();
        // Rediriger vers la page d'accueil
        this.router.navigate(['/home']);
      },
      (error) => {
        // Gérer les erreurs de déconnexion
        console.error('Erreur lors de la déconnexion :', error);
        // Même si la déconnexion échoue, essayez quand même de vider les données de l'utilisateur et de le rediriger
        this.tokenStorageService.signOut();
        this.router.navigate(['/home']);
      }
    );
  }
   
   
}
