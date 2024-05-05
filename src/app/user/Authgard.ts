import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    // Vérifier si l'utilisateur est connecté
    if (this.tokenStorage.getToken()) {
      // Si l'utilisateur est connecté, vérifiez son rôle
      const user = this.tokenStorage.getUser();
      if (user && user.roles && user.roles.includes('ADMIN')) {
        // Si l'utilisateur est un administrateur, redirigez-le vers la page homeadmin
        this.router.navigate(['/homeadmin']);
      } else {
        // Si l'utilisateur n'est pas un administrateur, redirigez-le vers la page d'accueil
        this.router.navigate(['/home']);
      }
      return false; // Retourne false pour empêcher l'accès à la page de connexion et d'inscription
    } else {
      return true; // Si l'utilisateur n'est pas connecté, autorisez l'accès à la page de connexion et d'inscription
    }
  }
}
