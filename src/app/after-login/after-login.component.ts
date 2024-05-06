import { Component } from '@angular/core';
import { TokenStorageService } from '../user/token-storage.service';

@Component({
  selector: 'app-after-login',
  templateUrl: './after-login.component.html',
  styleUrls: ['./after-login.component.css']
})
export class AfterLoginComponent {

  isCustomer: boolean = false;
  // Déclarez la variable correctement
   roles: string[] = [];
   constructor(private tokenStorageService: TokenStorageService) {
     // Vérifie si l'utilisateur est un client
     this.roles = this.tokenStorageService.getUser().roles; // Utilisez 'this' pour faire référence à la propriété de la classe
     if (this.roles.includes('CUSTOMER'))
       this.isCustomer = true;
       
   }
}
