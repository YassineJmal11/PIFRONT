import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service'; 

@Injectable({
  providedIn: 'root'
})
export class Adminguard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    // Vérifier si l'utilisateur est connecté et a le rôle d'administrateur dans le token
    if (this.tokenStorage.getUserRole() === 'ADMIN') {
      return true; // Autoriser l'accès à la page d'administration
    } else {
      this.router.navigate(['/home']); 
      return false;
    }
  }
}
